document.addEventListener('DOMContentLoaded', function() {
    // DOM元素
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const saveSvgBtn = document.getElementById('save-svg-btn');
    const savePngBtn = document.getElementById('save-png-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');
    const textArea = document.getElementById('tibetan-text');
    const textSource = document.getElementById('text-source');
    const wordcloudContainer = document.getElementById('wordcloud-container');
    const loadingIndicator = document.getElementById('loading');
    const wordCountSlider = document.getElementById('word-count');
    const wordCountValue = document.getElementById('word-count-value');
    const textFileInput = document.getElementById('text-file');
    const fileNameDisplay = document.getElementById('file-name');
    const customFontInput = document.getElementById('custom-font');
    const fileUploadContainer = document.getElementById('file-upload-container');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const nextToSettingsBtn = document.getElementById('next-to-settings');
    const backToInputBtn = document.getElementById('back-to-input');
    const nextToResultBtn = document.getElementById('generate-btn');
    const backToSettingsBtn = document.getElementById('back-to-settings');
    const minFontSizeSlider = document.getElementById('min-font-size');
    const maxFontSizeSlider = document.getElementById('max-font-size');
    const minFontSizeValue = document.getElementById('min-font-size-value');
    const maxFontSizeValue = document.getElementById('max-font-size-value');
    
    // 颜色选择器相关元素
    const colorItems = document.querySelectorAll('.color-item');
    const customColorPicker = document.getElementById('custom-color-picker');
    const selectedColorsContainer = document.getElementById('selected-colors');
    
    // 字体相关元素
    const uploadedFontsContainer = document.getElementById('uploaded-fonts');
    
    // 形状选择器
    const shapeSelector = document.getElementById('shape-selector');
    
    // 示例文本
    const sampleText = "༄༅། །རྒྱ་གར་སྐད་དུ། བོ་དྷི་སཏྭ་ཙརྻ་ཨ་བ་ཏ་ར། བོད་སྐད་དུ། བྱང་ཆུབ་སེམས་དཔའི་སྤྱོད་པ་ལ་འཇུག་པ། །སངས་རྒྱས་དང་བྱང་ཆུབ་སེམས་དཔའ་ཐམས་ཅད་ལ་ཕྱག་འཚལ་ལོ། །བདེ་གཤེགས་ཆོས་ཀྱི་སྐུ་མངའ་སྲས་བཅས་དང༌། །ཕྱག་འོས་ཀུན་ལའང་གུས་པར་ཕྱག་འཚལ་ཏེ། །བདེ་གཤེགས་སྲས་ཀྱི་སྡོམ་ལ་འཇུག་པ་ནི། །ལུང་བཞིན་མདོར་བསྡུས་ནས་ནི་བརྗོད་པར་བྱ། །སྔོན་ཆད་མ་བྱུང་བ་ཡང་འདིར་བརྗོད་མེད། །སྡེབ་སྦྱོར་མཁས་པའང་བདག་ལ་ཡོད་མིན་ཏེ། །དེ་ཕྱིར་གཞན་དོན་བསམ་པ་བདག་ལ་མེད། །རང་གི་ཡིད་ལ་བསྒོམ་ཕྱིར་ངས་འདི་བརྩམས། །དགེ་བ་བསྒོམ་ཕྱིར་བདག་གི་དད་པའི་ཤུགས། །འདི་དག་གིས་ཀྱང་རེ་ཞིག་འཕེལ་འགྱུར་ལ། །བདག་དང་སྐལ་བ་མཉམ་པ་གཞན་གྱིས་ཀྱང༌། །ཅི་སྟེ་འདི་དག་མཐོང་ན་དོན་ཡོད་འགྱུར།";
    
    // 字体选项（默认字体+上传的字体）
    let selectedFonts = ["Tunmi-Tibetan"]; // 默认使用吞弥恰俊字体
    let uploadedFonts = []; // 上传的字体列表
    
    // 颜色选择相关变量
    let selectedColors = ['#3b82f6']; // 默认选中的颜色
    
    // 初始化
    initializeApp();
    
    function initializeApp() {
        // 初始化显示词条数量
        updateWordCountDisplay();
        updateFontSizeDisplay();
        
        // 初始化事件监听器
        setupEventListeners();
        
        // 初始化颜色选择器
        initializeColorPicker();
        
        // 初始化字体选择
        initializeFontSelection();
        
        // 压缩顶部区域
        document.querySelector('.hero').classList.add('compact-hero');
    }
    
    function setupEventListeners() {
        // 标签页切换
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        // 导航按钮
        nextToSettingsBtn.addEventListener('click', () => switchTab('settings-tab'));
        backToInputBtn.addEventListener('click', () => switchTab('input-tab'));
        nextToResultBtn.addEventListener('click', generateWordCloud);
        backToSettingsBtn.addEventListener('click', () => switchTab('settings-tab'));
        
        // 功能按钮
        clearBtn.addEventListener('click', clearText);
        saveSvgBtn.addEventListener('click', saveSvgImage);
        savePngBtn.addEventListener('click', savePngImage);
        regenerateBtn.addEventListener('click', regenerateWordCloud);
        
        // 输入控件
        textSource.addEventListener('change', handleTextSourceChange);
        wordCountSlider.addEventListener('input', updateWordCountDisplay);
        textFileInput.addEventListener('change', handleTextFileUpload);
        customFontInput.addEventListener('change', handleFontFileUpload);
        
        // 字体大小滑块
        minFontSizeSlider.addEventListener('input', updateFontSizeDisplay);
        maxFontSizeSlider.addEventListener('input', updateFontSizeDisplay);
    }
    
    // 更新字体大小显示
    function updateFontSizeDisplay() {
        minFontSizeValue.textContent = minFontSizeSlider.value + 'px';
        maxFontSizeValue.textContent = maxFontSizeSlider.value + 'px';
        
        // 确保最小值不大于最大值
        if (parseInt(minFontSizeSlider.value) > parseInt(maxFontSizeSlider.value)) {
            maxFontSizeSlider.value = minFontSizeSlider.value;
            maxFontSizeValue.textContent = maxFontSizeSlider.value + 'px';
        }
    }
    
    // 处理多个字体文件上传
    function handleFontFileUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        files.forEach(file => {
            // 检查文件类型
            if (!file.name.match(/\.(ttf|otf)$/i)) {
                showMessage(`文件 ${file.name} 不是有效的字体文件`, 'error');
                return;
            }
            
            // 检查是否已经上传过
            if (uploadedFonts.some(font => font.name === file.name)) {
                showMessage(`字体 ${file.name} 已经存在`, 'error');
                return;
            }
            
            // 创建字体URL
            const fontUrl = URL.createObjectURL(file);
            const fontName = file.name.split('.')[0];
            const fontFamily = `${fontName}, sans-serif`;
            
            // 动态添加字体
            const fontFace = new FontFace(fontName, `url(${fontUrl})`);
            fontFace.load().then(function(loadedFace) {
                document.fonts.add(loadedFace);
                
                // 添加到上传字体列表
                uploadedFonts.push({
                    name: file.name,
                    fontName: fontName,
                    fontFamily: fontFamily,
                    url: fontUrl
                });
                
                // 添加到选中字体列表
                selectedFonts.push(fontFamily);
                
                // 更新界面显示
                updateUploadedFontsDisplay();
                
                console.log(`字体 "${fontName}" 已加载成功!`);
                showMessage(`字体 "${fontName}" 已加载成功!`, 'success');
            }).catch(function(error) {
                console.error('字体加载失败:', error);
                showMessage('字体加载失败: ' + error.message, 'error');
                // 清理失败的字体URL
                URL.revokeObjectURL(fontUrl);
            });
        });
        
        // 清空文件输入
        e.target.value = '';
    }
    
    // 更新上传字体显示
    function updateUploadedFontsDisplay() {
        uploadedFontsContainer.innerHTML = '';
        
        if (uploadedFonts.length === 0) {
            // 当没有上传字体时，不显示容器
            uploadedFontsContainer.style.display = 'none';
            return;
        }
        
        // 显示容器
        uploadedFontsContainer.style.display = 'flex';
        
        uploadedFonts.forEach((font, index) => {
            const fontTag = document.createElement('div');
            fontTag.className = 'font-tag';
            fontTag.innerHTML = `
                <span class="font-name">${font.fontName}</span>
                <button class="remove-font" data-index="${index}" title="删除字体">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // 添加删除事件
            const removeBtn = fontTag.querySelector('.remove-font');
            removeBtn.addEventListener('click', () => removeFontByIndex(index));
            
            uploadedFontsContainer.appendChild(fontTag);
        });
    }
    
    // 删除字体
    function removeFontByIndex(index) {
        const font = uploadedFonts[index];
        if (!font) return;
        
        // 从选中字体列表中移除
        selectedFonts = selectedFonts.filter(f => f !== font.fontFamily);
        
        // 清理字体URL
        URL.revokeObjectURL(font.url);
        
        // 从上传字体列表中移除
        uploadedFonts.splice(index, 1);
        
        // 更新显示
        updateUploadedFontsDisplay();
        
        showMessage(`字体 "${font.fontName}" 已删除`, 'success');
    }
    
    // 初始化字体选择
    function initializeFontSelection() {
        // 确保至少有默认字体
        if (selectedFonts.length === 0) {
            selectedFonts = ["Tunmi-Tibetan"];
        }
        updateUploadedFontsDisplay();
    }
    
    // 标签页切换
    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // 初始化颜色选择器
    function initializeColorPicker() {
        // 自定义颜色选择器
        customColorPicker.addEventListener('input', function() {
            addSelectedColor(this.value);
        });
        
        // 初始化已选颜色显示
        updateSelectedColorsDisplay();
        
        // 为已选颜色添加删除功能
        selectedColorsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('selected-color-item')) {
                const color = e.target.getAttribute('data-color');
                removeSelectedColor(color);
            }
        });
    }
    
    // 添加选中的颜色
    function addSelectedColor(color) {
        if (!selectedColors.includes(color)) {
            selectedColors.push(color);
            updateSelectedColorsDisplay();
        }
    }
    
    // 移除选中的颜色
    function removeSelectedColor(color) {
        if (selectedColors.length > 1) { // 至少保留一种颜色
            selectedColors = selectedColors.filter(c => c !== color);
            updateSelectedColorsDisplay();
        }
    }
    
    // 更新已选颜色显示
    function updateSelectedColorsDisplay() {
        selectedColorsContainer.innerHTML = '';
        selectedColors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'selected-color-item';
            colorItem.style.backgroundColor = color;
            colorItem.setAttribute('data-color', color);
            selectedColorsContainer.appendChild(colorItem);
        });
    }
    
    // 文本来源切换处理
    function handleTextSourceChange() {
        if (textSource.value === 'sample') {
            textArea.value = sampleText;
            fileUploadContainer.classList.add('hidden');
        } else if (textSource.value === 'file') {
            fileUploadContainer.classList.remove('hidden');
        } else {
            textArea.value = '';
            fileUploadContainer.classList.add('hidden');
        }
    }
    
    // 处理文本文件上传
    function handleTextFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        fileNameDisplay.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            textArea.value = e.target.result;
        };
        reader.readAsText(file);
    }
    
    // 显示消息
    function showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(messageEl);
        
        // 显示动画
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // 自动移除
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
    
    // 更新词条数量显示
    function updateWordCountDisplay() {
        wordCountValue.textContent = wordCountSlider.value;
    }
    
    // 清除文本
    function clearText() {
        textArea.value = '';
        fileNameDisplay.textContent = '未选择文件';
        textFileInput.value = '';
    }
    
    // 保存SVG图片
    async function saveSvgImage() {
        const svg = document.querySelector('#wordcloud-container svg');
        if (!svg) {
            showMessage('请先生成词云', 'error');
            return;
        }
        
        try {
            // 克隆SVG元素
            const clonedSvg = svg.cloneNode(true);
            
            // 添加XML声明和名称空间
            clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            
            // 创建样式标签来嵌入字体
            const styleElement = document.createElement('style');
            let cssText = '';
            
            // 添加所有上传字体的@font-face定义
            const fontPromises = uploadedFonts.map(async (font) => {
                try {
                    const response = await fetch(font.url);
                    const arrayBuffer = await response.arrayBuffer();
                    const base64 = arrayBufferToBase64(arrayBuffer);
                    
                    cssText += `
                        @font-face {
                            font-family: '${font.fontFamily}';
                            src: url('data:font/truetype;base64,${base64}') format('truetype');
                            font-weight: normal;
                            font-style: normal;
                        }
                    `;
                } catch (error) {
                    console.warn(`无法嵌入字体 ${font.fontFamily}:`, error);
                }
            });
            
            await Promise.all(fontPromises);
            
            // 添加默认字体定义
            cssText += `
                @font-face {
                    font-family: 'Tunmi-Tibetan';
                    src: url('../fonts/吞弥恰俊——尼赤乌坚体.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
            `;
            
            styleElement.textContent = cssText;
            
            // 将样式插入到SVG的defs元素中
            let defs = clonedSvg.querySelector('defs');
            if (!defs) {
                defs = document.createElement('defs');
                clonedSvg.insertBefore(defs, clonedSvg.firstChild);
            }
            defs.appendChild(styleElement);
            
            // 直接使用原始text元素的属性，确保字体和颜色正确保存
            const originalTextElements = svg.querySelectorAll('text');
            const clonedTextElements = clonedSvg.querySelectorAll('text');
            
            originalTextElements.forEach((originalText, index) => {
                if (clonedTextElements[index]) {
                    const clonedText = clonedTextElements[index];
                    
                    // 优先使用数据属性中存储的原始信息
                    const originalFontFamily = originalText.getAttribute('data-original-font-family') || 
                                              originalText.style.fontFamily || 
                                              window.getComputedStyle(originalText).fontFamily;
                    const originalFontSize = originalText.getAttribute('data-font-size') + 'px' || 
                                            originalText.style.fontSize || 
                                            window.getComputedStyle(originalText).fontSize;
                    const originalFill = originalText.getAttribute('data-original-color') || 
                                        originalText.style.fill || 
                                        window.getComputedStyle(originalText).fill;
                    const originalFontWeight = originalText.style.fontWeight || 
                                              window.getComputedStyle(originalText).fontWeight || 
                                              '600';
                    const originalOpacity = originalText.style.opacity || 
                                           window.getComputedStyle(originalText).opacity || 
                                           '1';
                    
                    // 清理字体名称中的引号和特殊字符
                    const cleanFontFamily = originalFontFamily.replace(/["/]/g, '').trim();
                    
                    console.log(`保存第${index}个词: 字体=${cleanFontFamily}, 颜色=${originalFill}`);
                    
                    // 设置内联样式到克隆的text元素
                    clonedText.setAttribute('style', 
                        `font-family: "${cleanFontFamily}"; ` +
                        `font-size: ${originalFontSize}; ` +
                        `font-weight: ${originalFontWeight}; ` +
                        `fill: ${originalFill}; ` +
                        `opacity: ${originalOpacity};`
                    );
                    
                    // 确保保留transform和其他重要属性
                    if (originalText.getAttribute('transform')) {
                        clonedText.setAttribute('transform', originalText.getAttribute('transform'));
                    }
                    if (originalText.getAttribute('text-anchor')) {
                        clonedText.setAttribute('text-anchor', originalText.getAttribute('text-anchor'));
                    }
                }
            });
            
            // 序列化SVG
            const svgData = new XMLSerializer().serializeToString(clonedSvg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            
            // 创建下载链接
            const url = URL.createObjectURL(svgBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `藏文词云_${new Date().toISOString().slice(0, 10)}.svg`;
            
            // 触发下载
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 清理URL
            URL.revokeObjectURL(url);
            
            showMessage('SVG文件保存成功', 'success');
        } catch (error) {
            console.error('保存SVG失败:', error);
            showMessage('保存SVG失败: ' + error.message, 'error');
        }
    }
    
    // ArrayBuffer转Base64的辅助函数
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    
    // 保存高清PNG图片
    async function savePngImage() {
        const svg = document.querySelector('#wordcloud-container svg');
        if (!svg) {
            showMessage('请先生成词云', 'error');
            return;
        }
        
        try {
            // 首先加载所有字体到页面
            const fontLoadPromises = uploadedFonts.map(font => {
                const fontFace = new FontFace(font.fontFamily, `url(${font.url})`);
                return fontFace.load().then(loadedFont => {
                    document.fonts.add(loadedFont);
                    return loadedFont;
                }).catch(error => {
                    console.warn(`无法加载字体 ${font.fontFamily}:`, error);
                    return null;
                });
            });
            
            await Promise.all(fontLoadPromises);
            await document.fonts.ready;
            
            // 创建高清canvas
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            const svgWidth = parseInt(svg.getAttribute('width'));
            const svgHeight = parseInt(svg.getAttribute('height'));
            const scale = 3; // 3倍高清
            canvas.width = svgWidth * scale;
            canvas.height = svgHeight * scale;
            context.scale(scale, scale);
            
            // 设置白色背景
            context.fillStyle = 'white';
            context.fillRect(0, 0, svgWidth, svgHeight);
            
            // 克隆并修复 SVG
            const clonedSvg = svg.cloneNode(true);
            clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
            
            // 添加字体样式
            const styleElement = document.createElement('style');
            let cssText = '';
            
            // 嵌入上传的字体
            const fontPromises = uploadedFonts.map(async (font) => {
                try {
                    const response = await fetch(font.url);
                    const arrayBuffer = await response.arrayBuffer();
                    const base64 = arrayBufferToBase64(arrayBuffer);
                    
                    cssText += `
                        @font-face {
                            font-family: '${font.fontFamily}';
                            src: url('data:font/truetype;base64,${base64}') format('truetype');
                            font-weight: normal;
                            font-style: normal;
                        }
                    `;
                } catch (error) {
                    console.warn(`无法嵌入字体 ${font.fontFamily}:`, error);
                }
            });
            
            await Promise.all(fontPromises);
            
            // 添加默认字体
            cssText += `
                @font-face {
                    font-family: 'Tunmi-Tibetan';
                    src: url('../fonts/吞弥恰俊——尼赤乌坚体.ttf') format('truetype');
                    font-weight: normal;
                    font-style: normal;
                }
            `;
            
            styleElement.textContent = cssText;
            
            let defs = clonedSvg.querySelector('defs');
            if (!defs) {
                defs = document.createElement('defs');
                clonedSvg.insertBefore(defs, clonedSvg.firstChild);
            }
            defs.appendChild(styleElement);
            
            // 修复text元素的样式
            const originalTextElements = svg.querySelectorAll('text');
            const clonedTextElements = clonedSvg.querySelectorAll('text');
            
            originalTextElements.forEach((originalText, index) => {
                if (clonedTextElements[index]) {
                    const clonedText = clonedTextElements[index];
                    
                    // 优先使用数据属性中存储的原始信息
                    const originalFontFamily = originalText.getAttribute('data-original-font-family') || 
                                              originalText.style.fontFamily || 
                                              window.getComputedStyle(originalText).fontFamily;
                    const originalFontSize = originalText.getAttribute('data-font-size') + 'px' || 
                                            originalText.style.fontSize || 
                                            window.getComputedStyle(originalText).fontSize;
                    const originalFill = originalText.getAttribute('data-original-color') || 
                                        originalText.style.fill || 
                                        window.getComputedStyle(originalText).fill;
                    const originalFontWeight = originalText.style.fontWeight || 
                                              window.getComputedStyle(originalText).fontWeight || 
                                              '600';
                    const originalOpacity = originalText.style.opacity || 
                                           window.getComputedStyle(originalText).opacity || 
                                           '1';
                    
                    const cleanFontFamily = originalFontFamily.replace(/["/]/g, '').trim();
                    
                    clonedText.setAttribute('style', 
                        `font-family: "${cleanFontFamily}"; ` +
                        `font-size: ${originalFontSize}; ` +
                        `font-weight: ${originalFontWeight}; ` +
                        `fill: ${originalFill}; ` +
                        `opacity: ${originalOpacity};`
                    );
                    
                    if (originalText.getAttribute('transform')) {
                        clonedText.setAttribute('transform', originalText.getAttribute('transform'));
                    }
                    if (originalText.getAttribute('text-anchor')) {
                        clonedText.setAttribute('text-anchor', originalText.getAttribute('text-anchor'));
                    }
                }
            });
            
            // 转换SVG为图像
            const svgData = new XMLSerializer().serializeToString(clonedSvg);
            const img = new Image();
            
            await new Promise((resolve, reject) => {
                img.onload = function() {
                    try {
                        context.drawImage(img, 0, 0);
                        
                        canvas.toBlob(function(blob) {
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `藏文词云_高清_${new Date().toISOString().slice(0, 10)}.png`;
                            
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            
                            URL.revokeObjectURL(url);
                            showMessage('高清PNG图片保存成功', 'success');
                            resolve();
                        }, 'image/png', 1.0);
                    } catch (error) {
                        console.error('绘制PNG失败:', error);
                        showMessage('绘制PNG失败: ' + error.message, 'error');
                        reject(error);
                    }
                };
                
                img.onerror = function(error) {
                    console.error('加载SVG图像失败:', error);
                    showMessage('SVG转换失败', 'error');
                    reject(error);
                };
                
                const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
                const url = URL.createObjectURL(svgBlob);
                img.src = url;
            });
            
        } catch (error) {
            console.error('保存PNG失败:', error);
            showMessage('保存PNG失败: ' + error.message, 'error');
        }
    }
    
    // 重新生成词云
    function regenerateWordCloud() {
        generateWordCloud();
    }
    
    // 生成词云
    function generateWordCloud() {
        const text = textArea.value.trim();
        if (!text) {
            alert('请输入藏文文本');
            return;
        }
        
        // 切换到结果标签页
        switchTab('result-tab');
        
        // 显示加载指示器
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.display = 'flex';
        wordcloudContainer.innerHTML = '';
        saveSvgBtn.disabled = true;
        savePngBtn.disabled = true;
        regenerateBtn.disabled = true;
        
        // 获取当前设置
        const maxWords = parseInt(wordCountSlider.value);
        const minFontSize = parseInt(minFontSizeSlider.value);
        const maxFontSize = parseInt(maxFontSizeSlider.value);
        const selectedShape = shapeSelector.value;
        
        // 发送文本到后端进行分词
        fetch('/tokenize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            
            // 处理分词结果，统计词频
            const wordFrequency = {};
            data.tokens.forEach(token => {
                // 忽略标点符号和空格
                if (token.pos !== 'PUNCT' && token.text.trim() !== '') {
                    if (wordFrequency[token.text]) {
                        wordFrequency[token.text]++;
                    } else {
                        wordFrequency[token.text] = 1;
                    }
                }
            });
            
            // 将词频转换为词云所需的格式并限制数量
            let words = Object.keys(wordFrequency)
                .map(word => ({
                    text: word,
                    size: minFontSize + (wordFrequency[word] / Math.max(...Object.values(wordFrequency))) * (maxFontSize - minFontSize),
                    frequency: wordFrequency[word]
                }))
                .sort((a, b) => b.frequency - a.frequency)
                .slice(0, maxWords);
            
            if (words.length === 0) {
                throw new Error('没有找到有效的词语');
            }
            
            // 生成词云
            createWordCloud(words, selectedShape);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('生成词云时出错: ' + error.message);
            loadingIndicator.classList.add('hidden');
        });
    }
    
    function createWordCloud(words, shapeName) {
        try {
            // 清空容器并设置尺寸
            wordcloudContainer.innerHTML = '';
            const width = wordcloudContainer.offsetWidth || 800;
            const height = 600;
            
            console.log("开始生成词云...", words.length, "个词");
            console.log("容器尺寸:", width, "x", height);
            console.log("当前选中字体:", selectedFonts);
            console.log("当前选中颜色:", selectedColors);
            
            // 创建SVG元素
            const svg = d3.select("#wordcloud-container").append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("opacity", 0);
            
            // 添加定义区域用于滤镜和渐变
            const defs = svg.append("defs");
            
            // 创建发光滤镜
            const glowFilter = defs.append("filter")
                .attr("id", "glow")
                .attr("x", "-50%")
                .attr("y", "-50%")
                .attr("width", "200%")
                .attr("height", "200%");
                
            glowFilter.append("feGaussianBlur")
                .attr("stdDeviation", "4")
                .attr("result", "coloredBlur");
                
            const feMerge = glowFilter.append("feMerge");
            feMerge.append("feMergeNode").attr("in", "coloredBlur");
            feMerge.append("feMergeNode").attr("in", "SourceGraphic");
            
            // 创建彩虹渐变
            const rainbowGradient = defs.append("linearGradient")
                .attr("id", "rainbow")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "100%")
                .attr("y2", "0%");
                
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
            colors.forEach((color, i) => {
                rainbowGradient.append("stop")
                    .attr("offset", `${(i / (colors.length - 1)) * 100}%`)
                    .attr("stop-color", color);
            });
            
            // 创建径向渐变背景
            const bgGradient = defs.append("radialGradient")
                .attr("id", "bgGradient")
                .attr("cx", "50%")
                .attr("cy", "50%")
                .attr("r", "50%");
                
            bgGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "rgba(255,255,255,0.1)")
                .attr("stop-opacity", 0.1);
                
            bgGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "rgba(255,255,255,0.05)")
                .attr("stop-opacity", 0.05);
            
            // 添加背景形状
            addShapeBackground(svg, shapeName, width, height);
            
            const g = svg.append("g")
                .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
            
            // 手动创建词云布局 - 使用确定性的字体分配
            const fontFamilyForWords = words.map((word, index) => {
                // 使用索引取模来确保字体分配的一致性，而不是随机分配
                const fontIndex = index % selectedFonts.length;
                const fontFamily = selectedFonts[fontIndex];
                const colorIndex = index % selectedColors.length;
                const baseColor = selectedColors[colorIndex];
                
                // 调试信息：记录前几个词的字体分配
                if (index < 5) {
                    console.log(`词 "${word.text}" 使用字体: ${fontFamily}, 颜色: ${baseColor}`);
                }
                
                return {
                    ...word,
                    fontFamily: fontFamily,
                    baseColor: baseColor,
                    index: index,
                    // 添加原始样式信息，便于保存时准确获取
                    originalFontFamily: fontFamily,
                    originalBaseColor: baseColor
                };
            });
            
            // 使用D3的布局算法
            const layout = d3.layout.cloud()
                .size([width * 0.9, height * 0.9])
                .words(fontFamilyForWords)
                .padding(8)
                .rotate(() => Math.random() * 60 - 30) // 随机轻微旋转
                .font(d => d.fontFamily)
                .fontSize(d => d.size)
                .spiral("archimedean") // 使用阿基米德螺旋
                .on("end", draw);
            
            // 根据选择的形状设置布局约束
            applyShapeConstraints(layout, shapeName, width * 0.9, height * 0.9);
            
            console.log("开始布局计算...");
            layout.start();
            
            // 绘制词云
            function draw(words) {
                console.log("布局计算完成，开始绘制...");
                
                // 先隐藏加载动画，防止动画失效
                setTimeout(() => {
                    loadingIndicator.classList.add('hidden');
                    loadingIndicator.style.display = 'none';
                }, 100);
                
                // SVG淡入动画
                svg.transition()
                    .duration(800)
                    .style("opacity", 1);
                
                // 添加粒子效果
                const particles = g.append("g").attr("class", "particles");
                for (let i = 0; i < 30; i++) {
                    particles.append("circle")
                        .attr("cx", (Math.random() - 0.5) * width * 0.8)
                        .attr("cy", (Math.random() - 0.5) * height * 0.8)
                        .attr("r", Math.random() * 3 + 1)
                        .attr("fill", selectedColors[Math.floor(Math.random() * selectedColors.length)])
                        .attr("opacity", 0)
                        .transition()
                        .duration(2000)
                        .delay(Math.random() * 3000)
                        .attr("opacity", 0.6)
                        .transition()
                        .duration(2000)
                        .attr("opacity", 0)
                        .attr("r", 0);
                }
                
                // 绘制词语
                const wordElements = g.selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .style("font-size", d => d.size + "px")
                    .style("font-family", d => d.fontFamily)
                    .style("font-weight", "600")
                    .style("fill", d => d.baseColor)
                    .style("opacity", 0)
                    .attr("text-anchor", "middle")
                    .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate || 0})`)     
                    .text(d => d.text)
                    .style("cursor", "pointer")
                    // 为每个text元素设置内联样式属性，确保保存时能正确获取
                    .each(function(d) {
                        // 设置内联样式属性，便于保存时获取
                        this.style.fontFamily = d.fontFamily;
                        this.style.fontSize = d.size + "px";
                        this.style.fontWeight = "600";
                        this.style.fill = d.baseColor;
                        this.style.opacity = "0";
                        
                        // 添加数据属性存储原始信息，作为保存时的备用方案
                        this.setAttribute('data-original-font-family', d.originalFontFamily);
                        this.setAttribute('data-original-color', d.originalBaseColor);
                        this.setAttribute('data-font-size', d.size);
                        this.setAttribute('data-word-index', d.index);
                    });
                
                // 词语出现动画 - 简化版本
                wordElements
                    .transition()
                    .duration(800)
                    .delay((d, i) => i * 50)
                    .style("opacity", 1)
                    .on("end", function(d, i) {
                        // 更新内联样式中的透明度
                        this.style.opacity = "1";
                        
                        // 添加悬停效果
                        d3.select(this)
                            .on("mouseover", function() {
                                d3.select(this)
                                    .transition()
                                    .duration(300)
                                    .style("font-size", (d.size * 1.2) + "px")
                                    .style("fill", "url(#rainbow)");
                            })
                            .on("mouseout", function() {
                                d3.select(this)
                                    .transition()
                                    .duration(300)
                                    .style("font-size", d.size + "px")
                                    .style("fill", d.baseColor)
                                    .on("end", function() {
                                        // 在动画结束后更新内联样式，使用原始数据
                                        this.style.fontSize = d.size + "px";
                                        this.style.fill = d.originalBaseColor || d.baseColor;
                                        this.style.fontFamily = d.originalFontFamily || d.fontFamily;
                                    });
                            });
                        
                        // 当最后一个词出现后，隐藏加载动画并启用保存按钮
                        if (i === words.length - 1) {
                            // 确保隐藏加载动画
                            loadingIndicator.classList.add('hidden');
                            loadingIndicator.style.display = 'none';
                            
                            // 启用按钮
                            saveSvgBtn.disabled = false;
                            savePngBtn.disabled = false;
                            regenerateBtn.disabled = false;
                            
                            console.log("词云绘制完成，加载动画已隐藏");
                        }
                    });
            }
            
            // 显示词语信息
            function showWordInfo(word) {
                // 移除之前的信息提示
                d3.select(".word-info").remove();
                
                const info = d3.select("body").append("div")
                    .attr("class", "word-info")
                    .style("position", "fixed")
                    .style("top", "50%")
                    .style("left", "50%")
                    .style("transform", "translate(-50%, -50%)")
                    .style("background", "rgba(0, 0, 0, 0.8)")
                    .style("color", "white")
                    .style("padding", "20px")
                    .style("border-radius", "12px")
                    .style("box-shadow", "0 10px 30px rgba(0, 0, 0, 0.3)")
                    .style("backdrop-filter", "blur(10px)")
                    .style("z-index", "1000")
                    .style("opacity", 0)
                    .html(`
                        <h3 style="margin: 0 0 10px 0; color: ${word.baseColor};">${word.text}</h3>
                        <p style="margin: 0; font-size: 14px;">出现次数: ${word.frequency}</p>
                        <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.7;">点击任意处关闭</p>
                    `);
                
                info.transition()
                    .duration(300)
                    .style("opacity", 1);
                
                // 点击关闭
                d3.select("body").on("click.wordinfo", function() {
                    info.transition()
                        .duration(200)
                        .style("opacity", 0)
                        .remove();
                    d3.select("body").on("click.wordinfo", null);
                });
            }
            
        } catch (error) {
            console.error("词云生成过程中出错:", error);
            alert("生成词云时出错: " + error.message);
            loadingIndicator.classList.add('hidden');
        }
    }
    
    // 应用形状约束函数
    function applyShapeConstraints(layout, shape, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        
        switch(shape) {
            case 'circle':
                const radius = Math.min(width, height) / 2 * 0.8;
                layout.spiral("rectangular").padding(6);
                break;
                
            case 'ellipse':
                layout.spiral("rectangular").padding(6);
                break;
                
            case 'triangle':
                layout.spiral("rectangular").padding(8);
                break;
                
            case 'diamond':
                layout.spiral("rectangular").padding(7);
                break;
                
            case 'pentagon':
                layout.spiral("rectangular").padding(6);
                break;
                
            case 'hexagon':
                layout.spiral("rectangular").padding(6);
                break;
                
            case 'star':
                layout.spiral("archimedean").padding(10);
                break;
                
            case 'heart':
                layout.spiral("rectangular").padding(8);
                break;
                
            case 'cloud':
                layout.spiral("archimedean").padding(5);
                break;
                
            default: // rectangle
                layout.spiral("rectangular").padding(8);
                break;
        }
    }
    
    // 添加形状背景函数
    function addShapeBackground(svg, shape, width, height) {
        const centerX = width / 2;
        const centerY = height / 2;
        const size = Math.min(width, height) * 0.4;
        
        switch(shape) {
            case 'circle':
                svg.append("circle")
                    .attr("cx", centerX)
                    .attr("cy", centerY)
                    .attr("r", size)
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'ellipse':
                svg.append("ellipse")
                    .attr("cx", centerX)
                    .attr("cy", centerY)
                    .attr("rx", size * 1.3)
                    .attr("ry", size * 0.8)
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'triangle':
                const trianglePoints = [
                    [centerX, centerY - size],
                    [centerX - size * 0.866, centerY + size * 0.5],
                    [centerX + size * 0.866, centerY + size * 0.5]
                ];
                svg.append("polygon")
                    .attr("points", trianglePoints.map(p => p.join(',')).join(' '))
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'diamond':
                const diamondPoints = [
                    [centerX, centerY - size],
                    [centerX + size, centerY],
                    [centerX, centerY + size],
                    [centerX - size, centerY]
                ];
                svg.append("polygon")
                    .attr("points", diamondPoints.map(p => p.join(',')).join(' '))
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'pentagon':
                const pentagonPoints = [];
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
                    pentagonPoints.push([
                        centerX + size * Math.cos(angle),
                        centerY + size * Math.sin(angle)
                    ]);
                }
                svg.append("polygon")
                    .attr("points", pentagonPoints.map(p => p.join(',')).join(' '))
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'hexagon':
                const hexagonPoints = [];
                for (let i = 0; i < 6; i++) {
                    const angle = i * Math.PI / 3;
                    hexagonPoints.push([
                        centerX + size * Math.cos(angle),
                        centerY + size * Math.sin(angle)
                    ]);
                }
                svg.append("polygon")
                    .attr("points", hexagonPoints.map(p => p.join(',')).join(' '))
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'star':
                const starPoints = [];
                for (let i = 0; i < 10; i++) {
                    const angle = (i * Math.PI / 5) - Math.PI / 2;
                    const radius = i % 2 === 0 ? size : size * 0.5;
                    starPoints.push([
                        centerX + radius * Math.cos(angle),
                        centerY + radius * Math.sin(angle)
                    ]);
                }
                svg.append("polygon")
                    .attr("points", starPoints.map(p => p.join(',')).join(' '))
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'heart':
                const heartPath = `M ${centerX},${centerY + size * 0.3} 
                    C ${centerX},${centerY - size * 0.2} ${centerX - size * 0.7},${centerY - size * 0.8} ${centerX - size * 0.5},${centerY - size * 0.3}
                    C ${centerX - size * 0.3},${centerY - size * 0.6} ${centerX},${centerY - size * 0.4} ${centerX},${centerY}
                    C ${centerX},${centerY - size * 0.4} ${centerX + size * 0.3},${centerY - size * 0.6} ${centerX + size * 0.5},${centerY - size * 0.3}
                    C ${centerX + size * 0.7},${centerY - size * 0.8} ${centerX},${centerY - size * 0.2} ${centerX},${centerY + size * 0.3} Z`;
                svg.append("path")
                    .attr("d", heartPath)
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            case 'cloud':
                const cloudPath = `M ${centerX - size * 0.6},${centerY}
                    C ${centerX - size * 0.8},${centerY - size * 0.3} ${centerX - size * 0.4},${centerY - size * 0.6} ${centerX - size * 0.1},${centerY - size * 0.5}
                    C ${centerX + size * 0.1},${centerY - size * 0.8} ${centerX + size * 0.5},${centerY - size * 0.6} ${centerX + size * 0.6},${centerY - size * 0.3}
                    C ${centerX + size * 0.8},${centerY - size * 0.1} ${centerX + size * 0.7},${centerY + size * 0.2} ${centerX + size * 0.4},${centerY + size * 0.3}
                    L ${centerX - size * 0.4},${centerY + size * 0.3}
                    C ${centerX - size * 0.7},${centerY + size * 0.2} ${centerX - size * 0.8},${centerY + size * 0.1} ${centerX - size * 0.6},${centerY} Z`;
                svg.append("path")
                    .attr("d", cloudPath)
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
                
            default: // rectangle
                svg.append("rect")
                    .attr("x", centerX - size * 1.2)
                    .attr("y", centerY - size * 0.8)
                    .attr("width", size * 2.4)
                    .attr("height", size * 1.6)
                    .attr("rx", 10)
                    .attr("fill", "url(#bgGradient)")
                    .attr("opacity", 0.2);
                break;
        }
    }
});