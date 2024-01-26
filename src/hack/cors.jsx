import React, { useEffect } from 'react';
import axios from 'axios';

export default function App() {
    useEffect(() => {
        const fetchData = async () => {
            try {
                // SMS
                    const body = {
                        mobile_phone: "998905391575",
                        message: `Assalom alaykum`,
                        from: 4546,
                    };

                    const apiUrl = 'https://cors-anywhere.herokuapp.com/http://notify.eskiz.uz/api/message/sms/send';
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDg3NzQ3NDIsImlhdCI6MTcwNjE4Mjc0Miwicm9sZSI6InVzZXIiLCJzaWduIjoiYzMyM2M2ZWFjZWQwOTg4N2E5ZTUwYTc4MDNkOWQ0NmJkNjczNGMyMTExNDZlNjMzNzAzYjcxNDkzYjMyNGM4YyIsInN1YiI6IjI1MDMifQ.b_HrJVFqdenseTGC2GVxdI3ZG1YfW02-2Qs_rUdOR04`,
                        },
                    };

                    const response1 = await axios.post(apiUrl, body, config);
                    console.log(response1);
                    alert("SMS");
                    // SMS
            } catch (error) {
                console.error('SMS ERRROR:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run effect only once on mount

    return (
        <></>
    );
}
