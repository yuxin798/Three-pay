document.addEventListener('DOMContentLoaded', function() {
    const amountInput = document.getElementById('amount');
    const keys = document.querySelectorAll('.key');
    const payButton = document.querySelector('.pay-btn');
    
    // 让输入框始终可见但不可编辑
    amountInput.addEventListener('focus', function(e) {
        // 不再阻止焦点，只确保不会弹出键盘
        this.setAttribute('readonly', 'readonly');
    });
    
    // 保持页面固定，防止iOS上弹性滚动引起的页面回弹
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.tagName !== 'INPUT') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // 当前输入的金额
    let currentAmount = '';
    
    // 更新付款按钮颜色
    function updatePayButtonColor() {
        if (currentAmount && parseFloat(currentAmount) > 0) {
            payButton.style.backgroundColor = '#1E90FF'; // 深蓝色
        } else {
            payButton.style.backgroundColor = '#87CEEB'; // 原来的淡蓝色
        }
    }
    
    // 为每个按键添加点击和触摸事件
    keys.forEach(key => {
        // 使用触摸事件以获得更好的移动端响应
        key.addEventListener('touchstart', handleKeyPress);
        key.addEventListener('click', handleKeyPress);
        
        // 防止触摸时出现阴影或高亮
        key.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('active');
        }, { passive: false });
        
        key.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
    
    function handleKeyPress() {
        const value = this.textContent;
        
        if (this.classList.contains('empty')) {
            return;
        }
        
        if (value === '⌫') {
            // 删除最后一个字符
            if (currentAmount.length > 0) {
                currentAmount = currentAmount.slice(0, -1);
            }
        } else if (value === 'C') {
            // 清空输入
            currentAmount = '';
        } else if (value === '付款') {
            // 处理付款逻辑
            if (currentAmount && parseFloat(currentAmount) > 0 && parseFloat(currentAmount) <= 5000) {
                // 直接跳转到指定URL，附加金额参数
                const amount = parseFloat(currentAmount).toFixed(2);
                const url = `https://nxt.nongxinyin.com/buybal-api/v1.0/cashier/initializWithAmount/9BD1F42E6DCABFE54C9849B036F640CE/${amount}`;
                window.location.href = url;
            }
        } else if (value !== '') {
            // 添加数字或小数点
            if (value === '.' && currentAmount.includes('.')) {
                // 已经有小数点了，不再添加
                return;
            }
            
            // 如果是第一个字符是0，且下一个不是小数点，则替换0
            if (currentAmount === '0' && value !== '.') {
                currentAmount = value;
            } else {
                currentAmount += value;
            }
            
            // 防止输入金额过大
            if (currentAmount.includes('.')) {
                const parts = currentAmount.split('.');
                if (parts[0].length > 4) { // 整数部分不超过4位
                    currentAmount = parts[0].slice(0, 4) + '.' + parts[1];
                }
                if (parts[1] && parts[1].length > 2) { // 小数部分不超过2位
                    currentAmount = parts[0] + '.' + parts[1].slice(0, 2);
                }
            } else if (currentAmount.length > 4) { // 整数不超过4位
                currentAmount = currentAmount.slice(0, 4);
            }
        }
        
        // 更新输入框显示
        amountInput.value = currentAmount;
        
        // 更新付款按钮颜色
        updatePayButtonColor();
    }
    
    // 禁用双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // 适配 iOS 设备
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    }, { passive: false });
}); 