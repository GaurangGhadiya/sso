export default async function handler(req, res) {
    try {

        const postData = {
            username: req.body.username,
            password: req.body.password,
            service_id: req.body.service_id,
            userDetails: req.body.userDetails
        };


        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user-login-open', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });


        if (response.status === 200) {
            const jsonData = await response.json();

            // const modifiedData = {
            //     name: jsonData.name,
            //     uid: jsonData.id,
            // }
            res.status(200).json(jsonData);

        } else if (response.status === 404) {

            const jsonData = await response.json();

            res.status(404).json(jsonData);
        } else {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}