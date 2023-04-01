import 'normalize.css';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
	MainContainer,
	ChatContainer,
	MessageList,
	Message,
	MessageInput,
	TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import {useState} from "react";


const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
	const [typing, setTyping] = useState(false);
	const [messages, setMessages] = useState([
		{
			message: "I'm Yorick , speak to me",
			sender: "ChatGPT"
		}
	]);
	const handleSend = async (message) => {
		const newMessage = {
			message: message,
			sender: "user",
			direction: "outgoing"
		}
		const newMessages = [...messages, newMessage];
		setMessages(newMessages);
		setTyping(true);
		await processMessageToChatGPT(newMessages)
	}

	async function processMessageToChatGPT(chatMessages) {
		let apiMessages = chatMessages.map((messagesObject) => {
			let role = "";
			if (messagesObject === "ChatGPT") {
				role = "assistant"
			} else {
				role = "user"
			}
			return {role: role, content: messagesObject.message}
		});

		const systemMessage = {
			role: "system",
			content: "Explain answer 42"
		}

		const apiRequestBody = {
			"model": "gpt-3.5-turbo",
			"messages": [
				systemMessage,
				...apiMessages]
		}

		await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(apiRequestBody)
		}).then((data) => {
			return data.json();
		}).then((data)=>{
			setMessages([...chatMessages,{
				message: data.choices[0].message.content,
				sender: "ChatGPT"
			}])
		})

	}

	return (
		<div className="App">
			<div className="App-Container" style={{position: "relative", height: "800px", width: "700px"}}>
				<MainContainer>
					<ChatContainer>
						<MessageList
							typingIndicator={typing ? <TypingIndicator content="reading your message.."/> : null}
						>
							{messages.map((message, i) => {
								return <Message key={i} model={message}/>
							})}
						</MessageList>
						<MessageInput placeholder="Type message here" onSend={handleSend}/>
					</ChatContainer>
				</MainContainer>
			</div>
		</div>
	)
}

export default App
