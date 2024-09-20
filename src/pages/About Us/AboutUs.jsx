import React, { useState } from "react";
import {
	FaLinkedin,
	FaGithub,
	FaFacebookF,
	FaTwitter,
	FaInstagram,
} from "react-icons/fa";
import emailjs from "emailjs-com";
//import CustomScrollbar from "../../components/CustomScrollbar"; // Import CustomScrollbar

const AboutUs = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [status, setStatus] = useState("");

	const founders = [
		{
			name: "Wahhab Mirza",
			role: "Founder & CEO",
			image: "https://via.placeholder.com/150",
			linkedIn: "https://linkedin.com/in/johndoe",
			github: "https://github.com/johndoe",
		},
	];

	
	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const sendEmail = (e) => {
		e.preventDefault();

		const { name, email, message } = formData;

		emailjs
			.send(
				"service_9p0t4g8",
				"template_rvxn3zg",
				{
					User_Name: name,
					User_Email: email,
					message: message,
				},
				"HQkGMM0RTKlsPivos"
			)
			.then(
				(response) => {
					console.log("Email sent successfully:", response);
					setStatus("Email sent successfully!");
					setFormData({ name: "", email: "", message: "" });
				},
				(error) => {
					console.log("Email failed to send:", error);
					setStatus("Failed to send email. Please try again.");
				}
			);
	};

	return (
		<div className="text-white p-8 rounded-lg mt-[3%] ml-[2%] sm:ml-[10%]">
			{/* How It Works Section */}
			<section style={{ textAlign: "justify" }} className="mb-12">
				<h1 className="text-4xl font-bold mb-6 text-blue-400">How It Works</h1>
				<p className="text-lg leading-relaxed mb-6">
					At <strong className="text-blue-500">Memehome</strong>, creating,
					promoting, and trading ERC20 tokens on the Base network is seamless:
				</p>
				<h3 className="text-2xl font-semibold mb-4 text-blue-400">
					Step 1: Token Creation
				</h3>
				<ul className="list-disc list-inside text-lg mb-6">
					<li>Visit the token creation section on our platform.</li>
					<li>Enter your token name and symbol (e.g., "MyToken" and "MTK").</li>
					<li>
						Pay the small mining fee to launch your token on the blockchain.
					</li>
					<li>Your token is live and ready for promotion!</li>
				</ul>

				<h3 className="text-2xl font-semibold mb-4 text-blue-400">
					Step 2: Token Promotion
				</h3>
				<ul className="list-disc list-inside text-lg mb-6">
					<li>
						Share your token to attract buyers—its value increases as more users
						purchase it.
					</li>
					<li>
						Utilize our integrated promotional tools to increase your token's
						visibility.
					</li>
				</ul>

				<h3 className="text-2xl font-semibold mb-4 text-blue-400">
					Step 3: Token Trading
				</h3>
				<ul className="list-disc list-inside text-lg mb-6">
					<li>
						Trade your token or explore other users' tokens directly on the
						platform.
					</li>
					<li>
						Pay a minimal platform fee to engage in decentralized trading.
					</li>
					<li>
						The price of each token fluctuates based on market demand, offering
						a dynamic trading experience.
					</li>
				</ul>

				<p className="text-lg leading-relaxed mt-4">
					With <strong className="text-blue-500">Memehome</strong>, you have
					full control over the creation, promotion, and trading of tokens,
					making it easy for anyone to participate in decentralized finance.
				</p>
			</section>

			{/* Video Demo Section */}
			<section className="mb-12">
				<h2 className="text-3xl font-semibold mb-6 text-blue-400">
					Video Demo
				</h2>
				<div className="aspect-w-16 aspect-h-9">
					<iframe
						className="w-full h-full rounded-lg shadow-lg"
						src="https://www.youtube.com/embed/demo-video-link"
						title="Memehome Demo"
						allowFullScreen
					></iframe>
				</div>
			</section>

			{/* Introduction Section */}
			<section style={{ textAlign: "justify" }} className="mb-12">
				<h2 className="text-3xl font-semibold mb-6 text-blue-400">About Us</h2>
				<p className="text-lg leading-relaxed">
					Welcome to <strong className="text-blue-500">Memehome</strong>, a
					groundbreaking project by{" "}
					<strong className="text-blue-500">Sabasoft</strong>. We are
					revolutionizing the creation, trading, and management of ERC20 tokens
					on the Base network. Our platform provides a user-friendly experience
					for creating custom tokens, engaging in token trading, and exploring
					decentralized finance (DeFi). Whether launching or trading tokens,{" "}
					<strong>Memehome</strong> equips you with the tools to navigate the
					blockchain ecosystem.
				</p>
			</section>

			{/* Founders Section */}
			<section className="mb-12">
				<h2 className="text-3xl font-semibold mb-6 text-blue-400">Founder</h2>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-8">
					{founders.map((founder, index) => (
						<div
							key={index}
							className="text-center bg-gray-800 p-6 rounded-lg shadow-lg"
						>
							<img
								src={founder.image}
								alt={founder.name}
								className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
							/>
							<h3 className="text-lg font-bold mb-1">{founder.name}</h3>
							<p className="text-gray-400 mb-2">{founder.role}</p>
							<div className="flex justify-center gap-4">
								<a
									href={founder.linkedIn}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-400 hover:text-blue-600"
								>
									<FaLinkedin size={24} />
								</a>
								<a
									href={founder.github}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-400 hover:text-gray-600"
								>
									<FaGithub size={24} />
								</a>
							</div>
						</div>
					))}
				</div>
			</section>

			
			{/* Contact Us Section */}
			<section className="contact-section mb-12">
				<div className="container2">
					<h2 className="text-3xl font-semibold mb-6 text-blue-400">
						Contact Us
					</h2>
					<form
						id="contactForm"
						className="contact-form bg-gray-800 p-6 rounded-lg shadow-lg"
						onSubmit={sendEmail}
					>
						<label className="block text-lg mb-2" htmlFor="name">
							Name:
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full p-2 rounded-lg border-gray-700 bg-gray-900 text-white mb-4"
							required
						/>
						<label className="block text-lg mb-2" htmlFor="email">
							Email:
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full p-2 rounded-lg border-gray-700 bg-gray-900 text-white mb-4"
							required
						/>
						<label className="block text-lg mb-2" htmlFor="message">
							Message:
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							className="w-full p-2 rounded-lg border-gray-700 bg-gray-900 text-white mb-4"
							rows="5"
							required
						></textarea>
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
						>
							Send Message
						</button>
						{status && <p className="mt-4 text-lg">{status}</p>}
					</form>
					{/* Social Media Icons */}
					<div className="flex justify-center gap-6 mt-6">
						<a
							href="https://facebook.com/yourpage"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 hover:text-blue-600"
						>
							<FaFacebookF size={24} />
						</a>
						<a
							href="https://twitter.com/yourprofile"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:text-blue-500"
						>
							<FaTwitter size={24} />
						</a>
						<a
							href="https://instagram.com/yourprofile"
							target="_blank"
							rel="noopener noreferrer"
							className="text-pink-500 hover:text-pink-600"
						>
							<FaInstagram size={24} />
						</a>
					</div>
				</div>
			</section>
			<footer className="relative bottom-0 left-0 right-0 text-center p-2 bg-transparent text-white text-xs">
				<span>© 2024 Memehome. All rights reserved</span>
			</footer>
		</div>
		// </CustomScrollbar>  End of CustomScrollbar
	);
};

export default AboutUs;
