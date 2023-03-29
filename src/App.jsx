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

function App() {
	const [typing, setTyping] = useState(false);
	const [messages, setMessages] = useState([
		{
			message: "Heloo,my name is Skynet!",
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
