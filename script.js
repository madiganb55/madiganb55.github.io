let apiKey = '';
const chatDiv = document.getElementById('chat');
const inputField = document.getElementById('input');
const sendButton = document.getElementById('send');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyButton = document.getElementById('saveApiKey');

const messages = [{ role: 'system', content: 'You are a helpful assistant.' }];

// Enable chat inputs once API key is saved
saveApiKeyButton.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        apiKey = key;
        apiKeyInput.disabled = true;
        saveApiKeyButton.disabled = true;
        inputField.disabled = false;
        sendButton.disabled = false;
        inputField.focus();
        appendSystemMessage('API key saved. You can now start chatting.');
    } else {
        alert('Please enter a valid API key.');
    }
});

async function sendMessage() {
    const userInput = inputField.value.trim();
    if (!userInput) return;
    if (!apiKey) {
        alert('Please enter your API key first.');
        return;
    }

    // Display user message
    appendMessage('You', userInput);
    messages.push({ role: 'user', content: userInput });
    inputField.value = '';

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4.1-mini',
                messages: messages,
                max_tokens: 200,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const reply = response.data.choices[0].message.content.trim();
        appendMessage('Assistant', reply);
        messages.push({ role: 'assistant', content: reply });
    } catch (error) {
        console.error('Error:', error);
        appendMessage('Error', error.response?.data?.error?.message || error.message);
    }
}

function appendMessage(sender, text) {
    chatDiv.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

function appendSystemMessage(text) {
    chatDiv.innerHTML += `<p><em>${text}</em></p>`;
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
