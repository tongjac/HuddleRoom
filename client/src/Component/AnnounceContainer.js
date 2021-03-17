import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteBtn from "./DeleteBtn/index";

const AnnounceContainer = () => {
	const [form, setForm] = useState({ title: "", text: "" });

	const [posts, setPosts] = useState([]);

	const onChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const submitPost = async (e) => {
		e.preventDefault();
		const authToken = window.localStorage.getItem("auth-token");

		try {
			const newPost = await axios.post("/announce", form, {
				headers: { "x-auth-token": authToken },
			});

			console.log(newPost);
		} catch (err) {
			console.log(err);
		}
		window.location.reload();
	};

	const deletePost = async (id) => {
		try {
			await axios.delete(`/announce/${id}`, {
				headers: { "x-auth-token": localStorage.getItem("auth-token") },
			});
		} catch (err) {
			console.log(err);
		}
		window.location.reload();
	};

	useEffect(() => {
		(async () => {
			const allPosts = await axios.get("/announce", {
				headers: { "x-auth-token": localStorage.getItem("auth-token") },
			});

			//NOTE: This changes the format of the date, need to implement this to createdAt
			// const setTime =() => {
			// 	let lastAddedTime = allPosts.data.length - 1;
			// 	if (lastAddedTime >= 0) {
			// 		let newTime = new Date(
			// 			allPosts.data[lastAddedTime].createdAt
			// 		).toLocaleDateString("en-US", {
			// 			month: "short",
			// 			day: "numeric",
			// 			hour: "2-digit",
			// 			minute: "2-digit",
			// 			timeZone: "America/Los_Angeles",
			// 		});
			// 		console.log(newTime);
			// 	}
			// };

			setPosts(allPosts.data.reverse());
		})();
	}, []);

	return (
		<div>
			<h1>Hello from Announcement Container</h1>
			<form onSubmit={submitPost}>
				<input
					type="text"
					name="title"
					placeholder="Title"
					onChange={onChange}
				/>
				<br />
				<textarea
					type="text"
					name="text"
					placeholder="Text"
					onChange={onChange}
				/>
				<br />
				<button type="submit">Submit</button>
			</form>

			<table className="table">
				<thead>
					<tr>
						<th scope="col">Date</th>
						<th scope="col">Subject</th>
						<th scope="col">Message</th>
						<th scope="col">Name</th>
					</tr>
				</thead>
				<tbody>
					{posts.map((post, index) => (
						<tr key={index}>
							<th scope="row">{post.createdAt}</th>
							<td>{post.title}</td>
							<td>{post.text}</td>
							<td></td>
							<DeleteBtn onClick={() => deletePost(post._id)} />
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AnnounceContainer;
