const {Axios} = require('axios')
const {FCM_SERVER_KEY} = require('../../config')

// const notification = {
//     title: 'Notification Title',
//     body: 'Notification Body',
//   };

async function sendNotification(fcmTokens,notification,payload){
    const axios = new Axios()


    // fetch('https://fcm.googleapis.com/fcm/send', {
    // method: 'POST',
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'key=YOUR_SERVER_KEY',
    // },
    // body: JSON.stringify({
    //     to: fcmToken,
    //     notification: notification,
    // }),
    // })
    // .then(response => {
    // if (response.ok) {
    //     console.log('Notification sent successfully.');
    // } else {
    //     console.error('Failed to send notification.');
    // }
    // })
    // .catch(error => {
    // console.error('Error:', error);
    // });
    
    return new Promise((resolve,reject)=>{
        fcmTokens.forEach(async (to,i)=>{
            // await axios.post('https://fcm.googleapis.com/fcm/send',{to,notification},{
            //     headers:{
            //         'Authorization': FCM_SERVER_KEY
            //     }
            // })
    
            await fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': FCM_SERVER_KEY,
                },
                body: JSON.stringify({
                    to, notification,data:payload
                }),
            })
            if((i+1)===fcmTokens.length){
                return resolve()
            }
        })
    })
    
}

module.exports = sendNotification