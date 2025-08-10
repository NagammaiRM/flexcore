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
    else if (containsKeywords(message, ['colors', 'style', 'look', 'fashion', 'design', 'aesthetic'])) {
        response = "Style meets functionality! 🎨<br><br>" +
                  "🌈 <strong>12+ color combinations</strong> for base shoes<br>" +
                  "✨ <strong>50+ core designs</strong> from minimalist to bold<br>" +
                  "🎯 <strong>Mix & match</strong> - create your unique style<br>" +
                  "👔 <strong>Professional to Athletic</strong> - one shoe does it all<br><br>" +
                  "Popular combos: Midnight Base + Neon Running Cores, White Base + Wood Casual Cores!";
        suggestions = ['Show popular combinations', 'Professional styles', 'Bright/bold options'];
    }
    else if (containsKeywords(message, ['sport', 'athletic', 'running', 'gym', 'exercise', 'workout'])) {
        response = "FlexCore is perfect for athletes and fitness enthusiasts! 💪<br><br>" +
                  "🏃 <strong>Running Cores:</strong> Lightweight with responsive cushioning<br>" +
                  "⚽ <strong>Cleat Cores:</strong> Professional-grade traction<br>" +
                  "🏋️ <strong>Gym Cores:</strong> Stable base for lifting<br>" +
                  "🏀 <strong>Court Cores:</strong> Quick lateral movement support<br><br>" +
                  "Used by semi-pro athletes and weekend warriors alike!";
        suggestions = ['Running core details', 'Best for gym workouts', 'Professional athlete reviews'];
    }
    else if (containsKeywords(message, ['eco', 'environment', 'sustainable', 'green', 'recycled'])) {
        response = "We're committed to protecting our planet! 🌍<br><br>" +
                  "♻️ <strong>70% recycled materials</strong> in every product<br>" +
                  "🌱 <strong>Carbon-neutral shipping</strong><br>" +
                  "📦 <strong>Plastic-free packaging</strong><br>" +
                  "🔄 <strong>Modular design</strong> reduces waste by 60%<br><br>" +
                  "One FlexCore system replaces 5-10 traditional shoe purchases!";
        suggestions = ['Recycling program', 'Carbon footprint details', 'Sustainable materials'];
    }
    else if (containsKeywords(message, ['kids', 'children', 'child', 'youth', 'teen'])) {
        response = "Kids love FlexCore too! Perfect for growing feet. 👶<br><br>" +
                  "📏 <strong>Youth sizes:</strong> US 1-7<br>" +
                  "🎨 <strong>Fun designs:</strong> Glow-in-dark, LED, holographic<br>" +
                  "💡 <strong>Educational:</strong> Kids learn about modularity<br>" +
                  "💰 <strong>Cost-effective:</strong> One base grows with activity interests<br><br>" +
                  "Popular with parents - no more closets full of single-purpose shoes!";
        suggestions = ['Youth sizing guide', 'Fun core designs', 'Parent reviews'];
    }
    else if (containsKeywords(message, ['discount', 'sale', 'coupon', 'deal', 'promo', 'cheaper'])) {
        response = "I'd love to help you save! 💰<br><br>" +
                  "🎉 <strong>First-time buyers:</strong> 15% off with code FLEX15<br>" +
                  "📱 <strong>Newsletter signup:</strong> Get exclusive deals<br>" +
                  "🎁 <strong>Starter Kit:</strong> Already saves you $14.98!<br>" +
                  "👥 <strong>Refer friends:</strong> Both get 20% off<br><br>" +
                  "Plus, free shipping on orders over $50!";
        suggestions = ['Apply FLEX15 code', 'Refer a friend', 'Newsletter signup'];
    }
    else if (containsKeywords(message, ['problem', 'issue', 'broken', 'defect', 'warranty', 'complaint'])) {
        response = "I'm sorry you're having an issue! Let me help fix that right away. 🛠️<br><br>" +
                  "🔧 <strong>Quick fixes:</strong> 90% of issues resolve in minutes<br>" +
                  "📞 <strong>Direct support:</strong> Call us at 1-800-FLEXCORE<br>" +
                  "💬 <strong>Live chat:</strong> Available 24/7<br>" +
                  "🔄 <strong>Instant replacement:</strong> We ship before you send back<br><br>" +
                  "What specific issue are you experiencing? I can guide you through a solution!";
        suggestions = ['Core won\'t attach', 'Base shoe issues', 'Sizing problems'];
    }
    else if (containsKeywords(message, ['compare', 'vs', 'versus', 'difference', 'better', 'alternative'])) {
        response = "Great question! Here's how FlexCore stacks up: 📊<br><br>" +
                  "🆚 <strong>Traditional shoes:</strong> 1 purpose vs unlimited versatility<br>" +
                  "💰 <strong>Cost:</strong> $100 FlexCore vs $500+ for multiple shoes<br>" +
                  "🌍 <strong>Environmental:</strong> 60% less waste<br>" +
                  "🏠 <strong>Storage:</strong> 1 base + cores vs full shoe rack<br><br>" +
                  "What specific comparison are you curious about?";
        suggestions = ['vs Nike/Adidas', 'vs other modular shoes', 'Cost breakdown'];
    }
    else if (containsKeywords(message, ['business', 'bulk', 'corporate', 'team', 'company'])) {
        response = "FlexCore for Business - perfect for teams! 🏢<br><br>" +
                  "👥 <strong>Volume discounts:</strong> 25%+ off for 50+ units<br>" +
                  "🎨 <strong>Custom branding:</strong> Add your logo<br>" +
                  "📋 <strong>Easy management:</strong> Single purchase, multiple uses<br>" +
                  "💼 <strong>Corporate accounts:</strong> Simplified billing<br><br>" +
                  "Used by tech companies, restaurants, hospitals, and more!";
        suggestions = ['Volume pricing', 'Custom branding options', 'Corporate account setup'];
    }
    else if (containsKeywords(message, ['thanks', 'thank you', 'awesome', 'great', 'helpful', 'amazing'])) {
        response = "You're so welcome! 😊 That totally made my day! <br><br>" +
                  "I'm here 24/7 whenever you need help with FlexCore. Whether it's picking the perfect cores, " +
                  "tracking an order, or just chatting about our latest innovations!<br><br>" +
                  "Is there anything else I can help you with today? 🤖✨";
        suggestions = ['Browse products', 'Check order status', 'Learn about new features'];
    }
    else if (containsKeywords(message, ['bye', 'goodbye', 'see you', 'later', 'done', 'finished'])) {
        response = "Thanks for chatting with me today! 👋<br><br>" +
                  "Remember, I'm always here if you need anything. Have an amazing day, " +
                  "and welcome to the FlexCore family! 🎉<br><br>" +
                  "Transform every step! ✨";
        suggestions = ['Start shopping', 'Save this conversation', 'Rate this chat'];
    }
    else if (containsKeywords(message, ['hello', 'hi', 'hey', 'start', 'begin'])) {
        response = "Hey there! Welcome to FlexCore! 🎉<br><br>" +
                  "I'm FlexBot, your personal shoe assistant. I'm here to help you discover " +
                  "how our revolutionary modular system can transform your footwear game!<br><br>" +
                  "What would you like to know about FlexCore? I can help with products, sizing, " +
                  "orders, or just chat about why modular shoes are the future! 😊";
        suggestions = ['How does FlexCore work?', 'Show me products', 'Help me choose'];
    }
    // Fallback responses for unrecognized queries
    else {
        const fallbackResponses = [
            "That's a great question! 🤔 Could you tell me a bit more about what you're looking for? I'm here to help with anything FlexCore-related!",
            "I want to make sure I give you the best answer! Could you rephrase that or let me know what specific aspect of FlexCore you're curious about?",
            "Hmm, I'm not quite sure I understood that correctly. Are you asking about our products, ordering process, or something else? I'm here to help! 😊",
            "I'd love to help you with that! Could you give me a bit more detail about what you're trying to find out about FlexCore?"
        ];
        response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        suggestions = ['How does it work?', 'Show products', 'Pricing info', 'Contact support'];
    }
    
    // Hide typing indicator and show response
    hideTypingIndicator();
    addMessage(response, 'bot');
    conversationHistory.push({ role: 'bot', content: response });
    
    // Add quick reply suggestions
    if (suggestions.length > 0) {
        addQuickReplySuggestions(suggestions);
    }
    
    // Track bot response
    trackEvent('Chatbot', 'bot_response', 'generated');
}

// Utility function to check for keywords
function containsKeywords(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
}

// Quick Reply Suggestions
function addQuickReplySuggestions(suggestions) {
    const quickRepliesContainer = document.querySelector('.chatbot-quick-replies');
    if (quickRepliesContainer) {
        quickRepliesContainer.innerHTML = '';
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = suggestion;
            button.onclick = () => handleQuickReply(suggestion);
            quickRepliesContainer.appendChild(button);
        });
    }
}

// Quick Reply Handler
function handleQuickReply(reply) {
    if (chatbotInput) {
        chatbotInput.value = reply;
        sendMessage(new Event('submit'));
    }
    
    trackEvent('Chatbot', 'quick_reply', reply);
}

// Dark Mode Toggle
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('chatbot-dark-mode', isDarkMode);
    
    if (chatbotContainer) {
        chatbotContainer.classList.toggle('dark-mode', isDarkMode);
    }
    
    trackEvent('Chatbot', 'dark_mode_toggle', isDarkMode ? 'enabled' : 'disabled');
}

// Conversation Management
function clearConversation() {
    if (chatbotMessages) {
        // Keep only the initial greeting
        const initialMessage = chatbotMessages.querySelector('.message.bot-message');
        chatbotMessages.innerHTML = '';
        if (initialMessage) {
            chatbotMessages.appendChild(initialMessage);
        }
    }
    
    conversationHistory = [{ role: 'bot', content: 'Hi there! Welcome to FlexCore! How can I help you today? 😊' }];
    
    trackEvent('Chatbot', 'conversation_cleared', 'user_action');
}

function exportConversation() {
    const conversation = conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'You' : 'FlexBot'}: ${msg.content.replace(/<br>/g, '\n').replace(/<[^>]*>/g, '')}`
    ).join('\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flexcore-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    trackEvent('Chatbot', 'conversation_exported', 'download');
}

// Chatbot Analytics
function analyzeChatbotUsage() {
    return {
        totalMessages: conversationHistory.length,
        userMessages: conversationHistory.filter(msg => msg.role === 'user').length,
        botMessages: conversationHistory.filter(msg => msg.role === 'bot').length,
        conversationLength: conversationHistory.length > 0 ? 
            (Date.now() - (conversationHistory[0].timestamp || Date.now())) / 1000 : 0,
        darkModeEnabled: isDarkMode,
        chatbotOpened: chatbotOpen
    };
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (chatbotOpen) {
        if (e.key === 'Enter' && !e.shiftKey && document.activeElement === chatbotInput) {
            e.preventDefault();
            sendMessage(e);
        }
        
        if (e.key === 'Escape') {
            toggleChatbot();
        }
        
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'k') {
                e.preventDefault();
                clearConversation();
            }
            
            if (e.key === 's') {
                e.preventDefault();
                exportConversation();
            }
        }
    }
});

// Chatbot Accessibility
function setupChatbotAccessibility() {
    if (chatbotToggle) {
        chatbotToggle.setAttribute('aria-label', 'Open customer support chat');
        chatbotToggle.setAttribute('role', 'button');
    }
    
    if (chatbotInput) {
        chatbotInput.setAttribute('aria-label', 'Type your message');
    }
    
    if (chatbotMessages) {
        chatbotMessages.setAttribute('role', 'log');
        chatbotMessages.setAttribute('aria-live', 'polite');
    }
}

// Advanced Features
function setupAdvancedChatbotFeatures() {
    // Auto-resize input
    if (chatbotInput) {
        chatbotInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Message reactions (future feature)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('message-reaction')) {
            const reaction = e.target.dataset.reaction;
            trackEvent('Chatbot', 'message_reaction', reaction);
        }
    });
    
    // Smart suggestions based on page context
    updateContextualSuggestions();
}

function updateContextualSuggestions() {
    const currentSection = getCurrentSection();
    let contextSuggestions = [];
    
    switch(currentSection) {
        case 'products':
            contextSuggestions = ['Which core is best for me?', 'Starter kit details', 'Size guide'];
            break;
        case 'features':
            contextSuggestions = ['How does QuickLock work?', 'Durability info', 'Comfort features'];
            break;
        case 'support':
            contextSuggestions = ['Return policy', 'Warranty details', 'Contact support'];
            break;
        default:
            contextSuggestions = ['How does FlexCore work?', 'Show me products', 'Pricing'];
    }
    
    // Update quick replies with contextual suggestions
    const quickReplies = document.querySelector('.chatbot-quick-replies');
    if (quickReplies && !chatbotOpen) {
        // Store for when chatbot opens
        window.contextualSuggestions = contextSuggestions;
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 'home';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 120) {
            currentSection = section.getAttribute('id');
        }
    });
    
    return currentSection;
}

// Initialize advanced features
document.addEventListener('DOMContentLoaded', () => {
    setupChatbotAccessibility();
    setupAdvancedChatbotFeatures();
});

// Export functions for global access
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.handleQuickReply = handleQuickReply;
window.toggleDarkMode = toggleDarkMode;
window.clearConversation = clearConversation;
window.exportConversation = exportConversation;
