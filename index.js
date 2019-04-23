const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const fs = require('fs');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/v1/users', function (req, res, next) { // API get list users

    try {
        const userDataPath = path.resolve('./data');
		let listUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
        listUsers = JSON.parse(listUsers);
        return res.status(200).json(listUsers);
       

    } catch(e) {
        console.error(e);
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
    }

});

app.get('/api/v1/users/:id', function (req, res, next) {
	try {
		const params = req.params;
		const getUserId = parseInt(params.id);
		if (isNaN(getUserId)) {
			return res.send({
				message: 'id have to be number'
			});
		}
		const userDataPath = path.resolve('./data');
		let gettingUsers =fs.readFileSync(userDataPath + '/users.json', 'utf8');
		gettingUsers =JSON.parse(gettingUsers);
		   let user = gettingUsers.find(item => item.id === getUserId);

		   if (user != undefined) {
			return res.status(200).json(user);

		} else {
			return res.status(400).json({
				message: 'Not found user'
			});
		}
	} catch (e) {
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
	}
})

app.delete('/api/v1/users/:id', (req, res, next) => { // API delete one user
	try {
		const params = req.params;
		const deletingUserId = parseInt(params.id);
		if (isNaN(deletingUserId)) {
			return res.status(400).json({
				message: 'id have to be number'
			});
		}
		const userDataPath = path.resolve('./data');
		let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
		existingUsers = JSON.parse(existingUsers);
		const userIndex = existingUsers.findIndex(function(item, index) {
			if (item.id === deletingUserId) {
				return true;
			}
		});
		console.log(userIndex);
		if (userIndex !== -1) {
			existingUsers.splice(userIndex, 1);
			fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers));
		} else {
			return res.status(400).json({
				message: 'Not found user'
			});
		}
		return res.status(200).json({
			message: 'Delete user ' + deletingUserId + ' successfully'
		});
	} catch(e) {
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
	}
});

app.post('/api/v1/users', function (req, res, next) { // API create new user
	try {
		const body = req.body;
		const username = body.username;
		const password = body.password;

		if (!username) {
			return res.status(400).json({
				message: 'username is required field'
			});
		}
		if (!password) {
			return res.status(400).json({
				message: 'password is required field'
			});
		}
		const newUser = {
			username: username,
			password: password
		};
		const userDataPath = path.resolve('./data');
		let existingUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
		if (!existingUsers) {
			existingUsers = [];
		} else {
			existingUsers = JSON.parse(existingUsers);
			if (!Array.isArray(existingUsers)) {
				return res.status(400).json({
					message: 'Database error'
				});
			}
		}
		newUser.id = existingUsers.length + 1;
		existingUsers.push(newUser);
		fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(existingUsers));
		return res.json({
			message: 'Create new user succesfully',
			data: newUser
		})
	} catch(e) {
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
	}
});

app.put('/api/v1/users/:id', (req, res, next) => {

	try {
		const params = req.params;
		const getUserId = parseInt(params.id);
		const body = req.body;
		if (isNaN(getUserId)) {
			return res.send({
				message: 'id have to be number'
			});
		}
		const userDataPath = path.resolve('./data');
		let listUsers = fs.readFileSync(userDataPath + '/users.json', 'utf8');
		listUsers = JSON.parse(listUsers);
		const userIndex = listUsers.findIndex((item, index) => {
			if (item.id === getUserId) {
				return true;
			}
		});

		   if (userIndex != -1) {
			if (body.username) {
				listUsers[userIndex].username = body.username; 
			}
			if (body.password) {
				listUsers[userIndex].password = body.password;
			}
			fs.writeFileSync(userDataPath + '/users.json', JSON.stringify(listUsers));
			return res.status(200).json({ message: 'Update user successfuly', user: listUsers[userIndex] });
		} else {
			return res.status(400).json({
				message: 'Not found user'
			});
		}
	} catch (e) {
		
		return res.status(400).json({
			message: 'Something went wrong',
			error: e
		});
	}
})

app.listen(port, function () {
	console.log(`Example app listening on port ${port}!`);
});
