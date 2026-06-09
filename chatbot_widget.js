// Chatbot Widget Script - Upgraded (Persistence + Context)

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject CSS
    const style = document.createElement('style');
    style.innerHTML = `
        #chatbot-container { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Outfit', sans-serif; }
        .chat-chip { background: white; border: 1px solid #0065ff; color: #0065ff; padding: 5px 12px; border-radius: 15px; font-size: 0.8rem; cursor: pointer; transition: all 0.2s; white-space: nowrap;}
        .chat-chip:hover { background: #0065ff; color: white; }
        .bot-msg { align-self: flex-start; background: white; padding: 10px 15px; border-radius: 0 12px 12px 12px; border: 1px solid #eee; max-width: 80%; font-size: 0.9rem; color: #333; box-shadow: 0 2px 5px rgba(0,0,0,0.03); }
        .user-msg { align-self: flex-end; background: #0065ff; color: white; padding: 10px 15px; border-radius: 12px 12px 0 12px; max-width: 80%; font-size: 0.9rem; box-shadow: 0 2px 5px rgba(0,101,255,0.2); }
        .msg-time { font-size: 0.65rem; opacity: 0.7; margin-top: 4px; display: block; text-align: right; }
        .typing-indicator { display: flex; gap: 4px; padding: 5px 10px; align-self: flex-start; background: white; border-radius: 12px; border: 1px solid #eee; }
        .typing-dot { width: 6px; height: 6px; background: #ccc; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; }
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typing { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } }
        /* Entrance Animation */
        #chatbot-window { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: bottom right; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML
    const container = document.createElement('div');
    container.id = 'chatbot-container';
    container.innerHTML = `
        <!-- Chat Toggle Button -->
        <button id="chatbot-toggle" onclick="toggleChat()" style="width: 60px; height: 60px; border-radius: 50%; background: #0065ff; color: white; border: none; box-shadow: 0 4px 15px rgba(0, 101, 255, 0.4); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; transition: transform 0.3s;">
            <i class="fas fa-robot"></i>
        </button>

        <!-- Chat Window -->
        <div id="chatbot-window" style="display: none; position: absolute; bottom: 80px; right: 0; width: 360px; height: 520px; background: #f4f7fa; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15); border: 1px solid #fff; flex-direction: column; overflow: hidden; transform: scale(0); opacity: 0;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0065ff 0%, #0056d6 100%); padding: 16px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="position: relative;">
                        <i class="fas fa-robot" style="background: white; color: #0065ff; padding: 10px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;"></i>
                        <span style="position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #00d287; border: 2px solid white; border-radius: 50%;"></span>
                    </div>
                    <div>
                        <h4 style="margin: 0; font-size: 1.05rem; font-weight: 600;">ClaimEasy Assistant</h4>
                        <span style="font-size: 0.75rem; opacity: 0.9;">Always here to help</span>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="clearChat()" title="Reset Chat" style="background: rgba(255,255,255,0.2); border: none; color: white; cursor: pointer; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><i class="fas fa-redo-alt" style="font-size: 0.8rem;"></i></button>
                    <button onclick="toggleChat()" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.1rem;"><i class="fas fa-times"></i></button>
                </div>
            </div>

            <!-- Messages Area -->
            <div id="chat-messages" style="flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth;">
                <!-- Messages will be injected here -->
            </div>

            <!-- Input Area -->
            <div style="padding: 15px; background: white; border-top: 1px solid #eee; display: flex; gap: 10px; align-items: center;">
                <input type="text" id="chat-input" placeholder="Type your query..." onkeypress="if(event.key === 'Enter') sendMessage()" style="flex: 1; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 25px; outline: none; font-size: 0.95rem; background: #f9f9f9; transition: border 0.2s;">
                <button onclick="sendMessage()" style="background: #0065ff; color: white; border: none; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,101,255,0.3); transition: transform 0.2s;">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Restore State
    restoreState();
});

// --- State Management ---
function saveState() {
    const messages = document.getElementById('chat-messages').innerHTML;
    const isOpen = document.getElementById('chatbot-window').style.display === 'flex';
    sessionStorage.setItem('chat_messages', messages);
    sessionStorage.setItem('chat_open', isOpen);
}

function restoreState() {
    const savedMessages = sessionStorage.getItem('chat_messages');
    const savedOpen = sessionStorage.getItem('chat_open'); // returns string "true" or "false"

    if (savedMessages && savedMessages.trim() !== '') {
        document.getElementById('chat-messages').innerHTML = savedMessages;
    } else {
        // Default Welcome Message if no history
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const defaultMsg = `
            <div class="bot-msg">
                Hello! 👋 I am your ClaimEasy Assistant.<br>I can help you with Quotes, Claims, and Renewals.
                <span class="msg-time">${time}</span>
            </div>
            <div id="chat-chips" style="display: flex; gap: 8px; flex-wrap: wrap; margin-left: 5px;">
                <button class="chat-chip" onclick="sendQuickMsg('Check Claim Status')">Check Status</button>
                <button class="chat-chip" onclick="sendQuickMsg('Get a Quote')">Get Quote</button>
                <button class="chat-chip" onclick="sendQuickMsg('Help & Support')">Support</button>
            </div>
        `;
        document.getElementById('chat-messages').innerHTML = defaultMsg;
    }

    if (savedOpen === 'true') {
        const window = document.getElementById('chatbot-window');
        const btn = document.getElementById('chatbot-toggle');
        window.style.display = 'flex';
        // Small delay to allow display flex to apply before opacity transition
        setTimeout(() => {
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        }, 10);
        btn.style.transform = 'scale(0)';
    }
}

function clearChat() {
    sessionStorage.removeItem('chat_messages');
    document.getElementById('chat-messages').innerHTML = '';
    restoreState(); // Re-adds welcome msg
}

// --- Interaction Functions ---
window.toggleChat = function () {
    const window = document.getElementById('chatbot-window');
    const btn = document.getElementById('chatbot-toggle');

    if (window.style.display === 'none' || window.style.opacity === '0') {
        window.style.display = 'flex';
        setTimeout(() => {
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        }, 10);
        btn.style.transform = 'scale(0)';
        sessionStorage.setItem('chat_open', 'true');
    } else {
        window.style.transform = 'scale(0)';
        window.style.opacity = '0';
        setTimeout(() => {
            window.style.display = 'none';
        }, 300); // Wait for animation
        btn.style.transform = 'scale(1)';
        sessionStorage.setItem('chat_open', 'false');
    }
};

window.sendQuickMsg = function (text) {
    document.getElementById('chat-input').value = text;
    sendMessage();
};

window.sendMessage = async function () {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    // Add User Message
    addMessage(message, 'user');
    input.value = '';

    // Hide initial chips if present
    const chips = document.getElementById('chat-chips');
    if (chips) chips.remove(); // Remove completely to avoid clutter

    // Add Typing Indicator
    const loadingId = addTypingIndicator();

    // Context Data
    let savedProduct = sessionStorage.getItem('chat_product') || '';
    
    // Role detection
    const adminStr = localStorage.getItem('adminUser');
    let userRole = 'user';
    let userEmail = '';
    if (adminStr) {
        try {
            const admin = JSON.parse(adminStr);
            userRole = 'admin';
            userEmail = admin.email;
        } catch(e) {}
    }

    const context = {
        page: window.location.pathname,
        title: document.title,
        product: savedProduct,
        role: userRole,
        email: userEmail
    };

    try {
        const response = await fetch('http://13.126.167.8:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, context })
        });
        const data = await response.json();

        if (data.detectedProduct) {
            sessionStorage.setItem('chat_product', data.detectedProduct);
        }

        // Remove loading and add Bot Message
        document.getElementById(loadingId).remove();
        addMessage(data.response, 'bot');

    } catch (error) {
        console.error(error);
        const l = document.getElementById(loadingId);
        if (l) l.remove();
        addMessage("Sorry, I'm having trouble connecting to the server.", 'bot');
    }
};

function addMessage(text, sender) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    div.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    div.innerHTML = `${text} <span class="msg-time">${time}</span>`;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    saveState(); // Save after every message
}

function addTypingIndicator() {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    const id = 'typing-' + Date.now();
    div.id = id;
    div.className = 'typing-indicator';
    div.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
}
