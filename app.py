from botok import WordTokenizer
from flask import Flask, request, jsonify, render_template, send_from_directory, url_for
from flask_cors import CORS
import json
import os
import shutil
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# 配置上传文件夹
UPLOAD_FOLDER = os.path.join('static', 'uploads')
FONT_FOLDER = os.path.join('static', 'fonts')
ALLOWED_EXTENSIONS = {'txt', 'ttf', 'otf'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['FONT_FOLDER'] = FONT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 限制上传文件大小为16MB

# 初始化分词器
tokenizer = WordTokenizer()

def allowed_file(filename, allowed_types):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_types

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tokenize', methods=['POST'])
def tokenize_text():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': '没有提供文本'}), 400
    
    text = data['text']
    tokens = tokenizer.tokenize(text)
    
    # 将分词结果转换为可序列化的格式
    result = []
    for token in tokens:
        result.append({
            'text': token.text,
            'pos': token.pos
        })
    
    return jsonify({'tokens': result})

@app.route('/upload/font', methods=['POST'])
def upload_font():
    """上传字体文件"""
    if 'font' not in request.files:
        return jsonify({'error': '没有提供字体文件'}), 400
    
    file = request.files['font']
    if file.filename == '':
        return jsonify({'error': '没有选择字体文件'}), 400
    
    if file and allowed_file(file.filename, {'ttf', 'otf'}):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['FONT_FOLDER'], filename)
        file.save(filepath)
        
        font_url = url_for('static', filename=f'fonts/{filename}')
        return jsonify({
            'success': True,
            'message': '字体上传成功',
            'font_name': filename.split('.')[0],
            'font_url': font_url
        })
    
    return jsonify({'error': '不支持的字体文件格式'}), 400

@app.route('/upload/text', methods=['POST'])
def upload_text():
    """上传文本文件"""
    if 'text' not in request.files:
        return jsonify({'error': '没有提供文本文件'}), 400
    
    file = request.files['text']
    if file.filename == '':
        return jsonify({'error': '没有选择文本文件'}), 400
    
    if file and allowed_file(file.filename, {'txt'}):
        try:
            content = file.read().decode('utf-8')
            return jsonify({
                'success': True,
                'content': content
            })
        except UnicodeDecodeError:
            return jsonify({'error': '文件编码不支持，请使用UTF-8编码'}), 400
    
    return jsonify({'error': '不支持的文本文件格式'}), 400

@app.route('/fonts/<path:filename>')
def serve_font(filename):
    """提供字体文件的路由"""
    return send_from_directory('static/fonts', filename)

# 确保所有必要的字体文件都可用
def setup_fonts():
    """确保所有必要的字体文件都可用"""
    os.makedirs(FONT_FOLDER, exist_ok=True)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    # 复制所有字体文件到static/fonts目录
    font_files = [
        'Qomolangma-Title.ttf',
        'Jomolhari-Regular.ttf',
        '方正藏意汉体简体.TTF',
        '吞弥恰俊——尼赤乌坚体.ttf'
    ]
    
    for font in font_files:
        source_path = os.path.join('fontfile', font)
        dest_path = os.path.join(FONT_FOLDER, font)
        
        # 如果源文件存在且目标文件不存在，则复制
        if os.path.exists(source_path) and not os.path.exists(dest_path):
            try:
                shutil.copy2(source_path, dest_path)
                print(f"已复制字体文件: {font}")
            except Exception as e:
                print(f"复制字体文件时出错: {e}")

if __name__ == '__main__':
    # 确保模板和静态文件目录存在
    os.makedirs('templates', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    # 设置字体
    setup_fonts()
    
    app.run(debug=True)
