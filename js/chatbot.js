// FlexCore Chatbot - Advanced AI Assistant

// Chatbot State
let chatbotOpen = false;
let isDarkMode = false;
let conversationHistory = [];
let isTyping = false;

// DOM Elements
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');

// Initialize Chatbot
document.addEventListener('DOMContentLoaded', function() {
    setupChatbot();
});

function setupChatbot() {
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', toggleChatbot);
    }
    
    // Auto-greet after a delay
    setTimeout(() => {
        if (!chatbotOpen && conversationHistory.length === 1) {
            showChatbotPreview();
        }
    }, 10000); // Show preview after 10 seconds
}

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    
    if (chatbotContainer) {
        chatbotContainer.classList.toggle('open', chatbotOpen);
        
        if (chatbotOpen) {
            chatbotInput?.focus();
            trackEvent('Chatbot', 'open', 'toggle_button');
        } else {
            trackEvent('Chatbot', 'close', 'toggle_button');
        }
    }
}

function showChatbotPreview() {
    if (chatbotOpen) return;
    
    // Create a small preview bubble
    const preview = document.createElement('div');
    preview.className = 'chatbot-preview';
    preview.innerHTML = `
        <div class="preview-content">
            <span class="preview-text">Need help? I'm here! 👋</span>
            <button class="preview-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(preview);
    
    setTimeout(() => {
        preview.classList.add('show');
    }, 100);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (preview.parentElement) {
            preview.classList.remove('show');
            setTimeout(() => {
                if (preview.parentElement) {
                    document.body.removeChild(preview);
                }
            }, 300);
        }
    }, 5000);
}

// Message Handling
function sendMessage(e) {
    e.preventDefault();
    
    if (!chatbotInput) return;
    
    const message = chatbotInput.value.trim();
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, 'user');
    conversationHistory.push({ role: 'user', content: message });
    
    // Clear input
    chatbotInput.value = '';
    
    // Show typing indicator and generate response
    showTypingIndicator();
    setTimeout(() => {
        generateBotResponse(message);
    }, 1000 + Math.random() * 1000); // Random delay for realism
    
    // Track message
    trackEvent('Chatbot', 'message_sent', 'user_input');
}

function addMessage(content, sender = 'bot', timestamp = null) {
    if (!chatbotMessages) return;
    
    const messageDiv = document.createElement('div');
    const currentTime = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-avatar">${sender === 'bot' ? '🤖' : '👤'}</div>
        <div class="message-content">
            <div class="message-text">${content}</div>
        </div>
        <div class="message-time">${currentTime}</div>
    `;
    
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Animation
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(20px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 50);
}

function showTypingIndicator() {
    if (isTyping) return;
    
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    isTyping = false;
}

// AI Response Generation
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    let response = '';
    let suggestions = [];
    
    // Intent Recognition and Response Generation
    if (containsKeywords(message, ['how', 'work', 'use', 'function'])) {
        response = "Great question! FlexCore works through our innovative modular system:<br><br>" +
                  "🔧 <strong>Base Shoe:</strong> Start with our comfortable Basic Bare foundation<br>" +
                  "⚡ <strong>Snap-On Cores:</strong> Choose cores for your activity (running, casual, cleats, etc.)<br>" +
                  "🔄 <strong>Quick Switch:</strong> Change cores in seconds with our QuickLock™ system<br><br>" +
                  "It's like having 10 different shoes in one! Would you like to see our core collection?";
        suggestions = ['Show me cores', 'How much does it cost?', 'Is it comfortable?'];
    }
    else if (containsKeywords(message, ['price', 'cost', 'expensive', 'cheap', 'money'])) {
        response = "Our pricing is designed to be super affordable! 💰<br><br>" +
                  "• <strong>Basic Bare:</strong> $19.99 (foundation shoe)<br>" +
                  "• <strong>Individual Cores:</strong> $19.99 each<br>" +
                  "• <strong>Starter Kit:</strong> $94.99 (Basic Bare + 2 cores - saves $14.98!)<br><br>" +
                  "Think about it - instead of buying 5 different pairs at $60+ each, you get unlimited variety for under $100! 🎯";
        suggestions = ['Tell me about the starter kit', 'What cores are available?', 'Do you have sales?'];
    }
    else if (containsKeywords(message, ['shipping', 'delivery', 'fast', 'when', 'arrive'])) {
        response = "We offer lightning-fast shipping! ⚡<br><br>" +
                  "📦 <strong>Standard Shipping:</strong> 3-5 business days (FREE on orders $50+)<br>" +
                  "🚀 <strong>Express Shipping:</strong> 1-2 business days ($9.99)<br>" +
                  "⚡ <strong>Same Day:</strong> Available in select cities ($19.99)<br><br>" +
                  "All orders ship within 24 hours, and you'll get tracking info immediately!";
        suggestions = ['Where do you ship?', 'Can I track my order?', 'Same day shipping areas'];
    }
    else if (containsKeywords(message, ['return', 'exchange', 'refund', 'unhappy', 'satisfied'])) {
        response = "We've got you covered with our <strong>Love It or Leave It</strong> guarantee! 💙<br><br>" +
                  "✅ <strong>30-day returns</strong> - no questions asked<br>" +
                  "✅ <strong>Free return shipping</strong><br>" +
                  "✅ <strong>Full refund</strong> or easy exchange<br>" +
                  "✅ <strong>Keep using</strong> while you decide<br><br>" +
                  "We're that confident you'll love FlexCore! Over 99% of customers keep their purchase. 😊";
        suggestions = ['How do I start a return?', 'Exchange for different size', 'What if cores don\'t fit?'];
    }
    else if (containsKeywords(message, ['size', 'sizing', 'fit', 'big', 'small', 'wide'])) {
        response = "Getting the perfect fit is crucial! 👟<br><br>" +
                  "📏 <strong>Size Range:</strong> US 5-15 (including half sizes)<br>" +
                  "📐 <strong>Width Options:</strong> Regular, Wide, Extra Wide<br>" +
                  "📱 <strong>Fit Finder:</strong> Use our AR app to scan your feet<br>" +
                  "📞 <strong>Personal Help:</strong> Our fit specialists are available 24/7<br><br>" +
                  "Pro tip: 94% of customers find their perfect fit using our size guide!";
        suggestions = ['Open size guide', 'Wide feet options', 'What if size is wrong?'];
    }
    else if (containsKeywords(message, ['comfortable', 'comfort', 'hurt', 'feet', 'cushion', 'support'])) {
        response = "Comfort is our #1 priority! 🌟<br><br>" +
                  "☁️ <strong>Memory foam insoles</strong> that adapt to your feet<br>" +
                  "🏃 <strong>Arch support</strong> designed by podiatrists<br>" +
                  "💨 <strong>Breathable materials</strong> keep feet cool<br>" +
                  "🔄 <strong>Flexibility</strong> moves naturally with your foot<br><br>" +
                  "Our customers regularly tell us these are the most comfortable shoes they've ever owned!";
        suggestions = ['What about arch support?', 'Good for standing all day?', 'Breathable for sports?'];
    }
    else if (containsKeywords(message, ['durable', 'last', 'wear out', 'quality', 'materials'])) {
        response = "Built to last! We use premium materials and rigorous testing. 💪<br><br>" +
                  "🔬 <strong>10,000+ step testing</strong> for each core design<br>" +
                  "🌧️ <strong>Weather resistant</strong> materials<br>" +
                  "♻️ <strong>Eco-friendly</strong> yet incredibly durable<br>" +
                  "🛡️ <strong>1-year warranty</strong> on all products<br><br>" +
                  "Average lifespan: 2-3 years with regular use (way longer than traditional shoes!)";
        suggestions = ['What\'s the warranty?', 'Weather resistant details', 'Eco-friendly materials'];
    }
    else if (containsKeywords(message, ['colors', 'style', 'look', 'fashion', 'design'])) {
        response = "FlexCore lets you match any mood or outfit! 🎨<br><br>" +
                  "🎯 <strong>Color Options:</strong> Over 20 vibrant and neutral tones<br>" +
                  "🖌️ <strong>Custom Designs:</strong> Limited edition artist collabs<br>" +
                  "🔄 <strong>Swap Styles:</strong> Change cores and laces in seconds<br>" +
                  "🌈 <strong>Mix & Match:</strong> Combine colors for a unique look<br><br>" +
                  "Whether you love bold statements or minimal vibes, FlexCore adapts to you!";
        suggestions = ['Show me color options', 'Any limited editions?', 'How to customize?'];
    }
    else {
        response = "I’m here to help you with anything about FlexCore! 🤖<br><br>" +
                  "You can ask me about:<br>" +
                  "• How FlexCore works<br>" +
                  "• Prices & deals<br>" +
                  "• Shipping & returns<br>" +
                  "• Sizes & comfort<br>" +
                  "• Colors & style<br><br>" +
                  "What would you like to know?";
        suggestions = ['How does it work?', 'Show me prices', 'What colors do you have?'];
    }

    // Add bot message
    hideTypingIndicator();
    addMessage(response, 'bot');
    conversationHistory.push({ role: 'bot', content: response });

    // Add suggestions if any
    if (suggestions.length > 0) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'suggestions';
        suggestions.forEach(text => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = text;
            btn.addEventListener('click', () => {
                chatbotInput.value = text;
                sendMessage(new Event('submit', { bubbles: true, cancelable: true }));
            });
            suggestionDiv.appendChild(btn);
        });
        chatbotMessages.appendChild(suggestionDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
}

// Helper function to check for keywords
function containsKeywords(text, keywords) {
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
}

// Dummy tracking function placeholder
function trackEvent(category, action, label) {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}
