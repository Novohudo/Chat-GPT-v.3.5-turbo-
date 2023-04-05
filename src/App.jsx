import 'normalize.css';
import './App.css';
import {useEffect, useRef, useState} from "react";

const API_KEY = import.meta.env.VITE_API_KEY;

function App() {
	const [typing, setTyping] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const myRef = useRef();

	useEffect(() => {
		const element = myRef.current;
		element.scrollTop = element.scrollHeight;
	});

	const handleSend = async (input) => {
		const newMessage = {
			message: input,
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
			content: "Speak normal"
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
		}).then((data) => {
			setMessages([...chatMessages, {
				message: data.choices[0].message.content,
				sender: "ChatGPT"
			}])
			setTyping(false);
			console.log(data)
		});
	}

	return (
		<div className="App" >
			<div className="App-Container" ref={myRef}>
				{messages.map((message, i) => {
					return <div  className="message-bubble" key={i}>
						<div className="avatar"/>
						<div className="text">{message.message}</div>
					</div>
				})}

				<div className="input-container">
					<form onSubmit={(e) => {e.preventDefault();handleSend(input);setInput('')}}>
						<input value={input} onChange={(e) => setInput(e.target.value)} placeholder="type your question here"/>
					</form>
				</div>
			</div>
		</div>
	)
}

export default App
