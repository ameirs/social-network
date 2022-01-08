    useEffect(() => {
        
        function getCoordinates(users) {
            const coordinatesArray = [];
            users.forEach((user) => {
                Geocode.fromAddress(user.city).then((geodata) => {
                    coordinatesArray.push({
                        lat: geodata.results[0].geometry.location.lat,
                        lng: geodata.results[0].geometry.location.lng,
                    });
                });
            });
            return coordinatesArray;
        }

        getCoordinates(users)
        // .then((coordinatesArray) => {
        //     console.log("coordinatesArray -> ", coordinatesArray);
        // });

        function getCoordinates(users) {

            return new Promise(resolve => {
                
                const coordinatesArray = [];
                users.forEach((user) => {
                    Geocode.fromAddress(user.city).then((geodata) => {
                        coordinatesArray.push({
                            lat: geodata.results[0].geometry.location.lat,
                            lng: geodata.results[0].geometry.location.lng,
                        });
                    });
                });
                return coordinatesArray;
            }) 
        }
 

// function createTicket(ticket) {
//     // 1 - Create a new Promise
//     return new Promise(function (resolve, reject) {
//         // 2 - Copy-paste your code inside this function
//         client.tickets.create(ticket, function (err, req, result) {
//             // 3 - in your async function's callback
//             // replace return by reject (for the errors) and resolve (for the results)
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(JSON.stringify(result));
//             }
//         });
//     });
// }






  CREATE TABLE posts(id SERIAL PRIMARY KEY, user_id INT REFERENCES users(id), post_text VARCHAR(700) NOT NULL, preview_url VARCHAR(255), preview_title VARCHAR(255), preview_img VARCHAR(255), preview_desc VARCHAR(700), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE link_preview(id SERIAL PRIMARY KEY, post_id INT REFERENCES posts(id), preview_url VARCHAR(255), preview_title VARCHAR(255), preview_img VARCHAR(255), preview_desc VARCHAR(700) NOT NULL);