export default async function handler(req, res) {
    try {

        const postData = {
            username: req.body.username,
            password: req.body.password,
            userDetails: req.body.userDetails
        };


        const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/user-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        });

        if (response.status === 200) {
            const jsonData = await response.json();

            const modifiedData = {
                name: jsonData.name,
                uid: jsonData.id,
            }
            res.status(200).json(modifiedData);

        } else if (response.status === 404) {
            res.status(404).json(response.data);
        }
        else if (response.status === 403) {
            res.status(404).json(response.data);
        }



        else {
            throw new Error('Network response was not ok');
        }

    } catch (error) {
        res.status(500).json({ error: error });
    }
}