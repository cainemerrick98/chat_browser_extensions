// Add your popup logic here
function initTextAreaResize() {
    const textarea = document.getElementById('chat_input');
    
    if (!textarea) {
        console.error('Could not find textarea with id "chat_input"');
        return;
    }
    
    // Set initial height
    adjustTextareaHeight(textarea);
    
    textarea.addEventListener('input', function() {
        adjustTextareaHeight(textarea);
    });
}

function adjustTextareaHeight(textarea) {
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set new height based on scroll height plus some padding
    textarea.style.height = (textarea.scrollHeight + 2) + 'px';
    
    // Ensure minimum height is maintained
    if (parseInt(textarea.style.height) < 60) {
        textarea.style.height = '60px';
    }
    
    // Prevent textarea from growing too large
    const maxHeight = 200;
    if (parseInt(textarea.style.height) > maxHeight) {
        textarea.style.height = maxHeight + 'px';
        textarea.style.overflowY = 'auto';
    } else {
        textarea.style.overflowY = 'hidden';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTextAreaResize();
    
    // Add click handler for send button
    const sendButton = document.getElementById('send_button');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
});
  
var chat_history = [];

function sendMessage() {
    console.log("Sending message");
    let message = getMessage();
    if (message == null){
        return;
    }
    chat_history.push({role: "user", content: message, sources: []});

    let chat_message = buildChatMessage({answer: message, sources: []}, "user");
    addChatMessage(chat_message);

    fetch("http://localhost:8000/chat", {
        method: "POST",
        body: JSON.stringify(message),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let chat_message = buildChatMessage(data, "agent");
        addChatMessage(chat_message);
    })
}

function addChatMessage(chat_message) {
    let chat_messages = document.getElementById('chat_messages');
    chat_messages.appendChild(chat_message);
}

function buildChatMessage(data, role) {
    let chat_message = document.createElement('div');
    chat_message.classList.add('chat-message');
    chat_message.classList.add(role === 'user' ? 'user-message' : 'agent-message');
    chat_message.innerHTML = `
        <div class="chat-message-content">
            <span class="chat-message-text">${data.answer}</span>
            <div class="sources">
                ${data.sources.map(source => `<div class="source-container">
                    <img height="16" width="16" src="icons/link_icon.jpg" class="source-image">
                    <a class="source" href="${source.link}">${source.title}</a>
                </div>`).join('')}
            </div>
        </div>
        `;
    return chat_message;
}

function getMessage() {
    let chat_textarea = document.getElementById('chat_input');
    if (chat_textarea.value.length > 0){
        let message = chat_textarea.value;
        chat_textarea.value = '';
        return message;
    }
    return null;
}
