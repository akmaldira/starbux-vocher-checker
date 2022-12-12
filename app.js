const axios = require('axios');
const cheerio = require('cheerio');
const baseURL = 'https://api2.sbuxcard.com/';
var readline = require('readline');
const fs = require('fs');
  
var rl = readline.createInterface(process.stdin, process.stdout);

var headers = {
    headers: {
        "user-agent": "Dart/2.17 (dart:io)",
        "accept-language": "en",
        "accept-encoding":"gzip",
        "host": "api2.sbuxcard.com",
        "content-type": "application/json"
    }
}

const getNumber = async (apiKey) => {
    console.log('Get Number');
    return await axios.get(`https://smshub.org/stubs/handler_api.php?api_key=${apiKey}&action=getNumber&service=sr&operator=OPERATOR&country=6`)
    .then(res => res.data)
    .catch(err => err)
}

const sendOTP = async(phoneNumber) => {
    console.log('Number : ', phoneNumber);
    console.log('Sendding OTP...');
    const body = JSON.stringify({
        phoneNumber,
    })
    headers.headers['x-signature'] = '1664788626331:2f7dc71648c3457e653e5c2845cfe99a9776c699796a9266179d1c076b1a879d'
    headers.headers['content-length'] = body.length
    return await axios.post(`${baseURL}/v1/auth/generate-sms-otp`, body, headers)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return {
            status: 500,
        }
    })
}

const getOTP = async (apiKey, id) => {
    return await axios.get(`https://smshub.org/stubs/handler_api.php?api_key=${apiKey}&action=getStatus&id=${id}`)
    .then((res) => {
        if(res.data.split(':')[0] !== 'STATUS_OK') {
            return 'belom'
        } else {
            console.log('OTP Found : ', res.data.split(":")[1]);
            return res.data.split(":")[1]
        }
    })
    .catch((err) => {
        console.log('Error nunggu');
    })
}

const verifyOTP = async (otp, phoneNumber) => {
    console.log('Verify OTP');
    const body = JSON.stringify({
        otp,
        phoneNumber,
    })
    headers.headers['x-signature'] = '1664789184951:93e5559ef8938c363c2334a87195c0f1353cd98173c21b0928655666d61cb20e'
    headers.headers['content-length'] = body.length
    return await axios.post(`${baseURL}/v1/auth/validate-sms-otp`, body, headers)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err);
    })
}

const generateEmail = async () => {
    return await axios.get('http://www.ninjaname.horseridersupply.com/indonesian_name.php')
    .then((res) => {
        var mapName = res.data.split('<br/>&bull; ')
        mapName.shift()
        mapName.pop()
        return mapName[0]
    })
    .catch((err) => {
        return 'Error'
    })
}

const registration = async (email, firstName, lastName, num, otp) => {
    const password = 'Akmal123!'
    const body = JSON.stringify({
        "email": email,
        "password": password,
        "external_id": null,
        "first_name": firstName,
        "last_name": lastName,
        "dob": "2000-12-31",
        "fav_beverage": "Macha",
        "direct_marcomm": true,
        "phone_number": num,
        "referralCode": "",
        "otp": otp
    })
    console.log(`Email : ${email}\nPassword : ${password}`);
    headers.headers['x-signature'] = '1664789255002:d03022b5ee02c55974ac93dd3aeccdaf71f9555405f8ac1df8bea0611a0c5c7f'
    headers.headers['content-length'] = body.length
    return await axios.post(`${baseURL}/v1/customer/registration`, body, headers)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err);
    })
}

const hitLogin = async (email, password) => {
    const body = JSON.stringify({
        "email": email,
        "password": password,
        "appAddress":"fHGVSNrRSDSgCXPaf0rFuf:APA91bHbngbmorb-fvCqHR8jMI3xxuRubPz6Lj5CV1mNHoFEoF__J_dz1txpO9A5WRYxaohC6XVxoSCDCdcueIJB3Rhlo7Cc4z4jxbxI4gksjIMrhOiYvw86BBzffK9MkTDLL64cs4NO",
        "appType":"ANDROID"
    })
    headers.headers['x-signature'] = '1664789305525:78bb3c2caaadf057b33b9fd84cfdbf3cfdf02065e25fb45fd2eeb199817aa1ee'
    headers.headers['content-length'] = body.length
    return await axios.post(`${baseURL}/v1/auth/login`, body, headers)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err.data
    })
}

const getEmailList = async (email) => {
    return await axios.get(`https://cryptogmail.com/api/emails?inbox=${email}`)
    .then(async(res) => {
        return res.data.data
    })
    .catch((err) => {
        return err
    })
}

const getEmailInbox = async (emailId) => {
    return await axios.get(`https://cryptogmail.com/api/emails/${emailId}`, {
        headers: {
            accept: 'text/html,text/plain'
        }
    })
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err);
    })
}

const verifyEmailOtp = async (otp, accessToken) => {
    const body = JSON.stringify({
        otp,
        accessToken,
    })
    headers.headers['x-signature'] = '1664789372815:1a863f2c507a0003066a51d2b0ade1708fe2f1381449b68e2cec42c994697bc7'
    headers.headers['content-length'] = body.length
    return await axios.post(`${baseURL}/v1/auth/validate-otp`, body, headers)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err);
    })
}


const getCardNumber = async (token, email) => {
    headers.headers['x-signature'] = '1664789544620:5f889569f90be06fa9e1b99e06b99400abaf683ff71bc5857795266a700bbb91'
    headers.headers['authorization'] = `Bearer ${token}`
    headers.headers['content-length'] ? delete headers.headers['content-length'] : null
    return await axios.get(`${baseURL}/v1/customer?email=${email}`, headers)
    .then((res) => {
        return res.data.card_information[0].external_id
    })
    .catch((err) => {
        console.log(err);
    })
}

const getVocher = async (token, externalId) => {
    headers.headers['x-signature'] = '1664789547314:fcc3ecc856b1590f5cb873e9a19c6451d1488806920e4af8c76e0fb34290b80c'
    headers.headers['authorization'] = `Bearer ${token}`
    headers.headers['content-length'] ? delete headers.headers['content-length'] : null
    return await axios.get(`${baseURL}/v1/content/get-offer?external_id=${externalId}`, headers)
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err);
    })
}

(async() => {
    const apiKey = '125662Uacdffb5342ea62b0e219b999b4bb48f1'
    // var getNum = await getNumber(apiKey)
    // const id = getNum.split(':')[1]
    // var num = getNum.split(':')[2]
    // num = num.slice(2)
    // const sendRequestOTP = await sendOTP('87883280288');
    // if (sendRequestOTP.status !== 200) {
    //     console.log('Number already registered or Error send OTP, wait a sec!');
    // } else {
    //     console.log('OTP Sent');
        // var otp;
        // const sleep = (milliseconds) => {
        //     const date = Date.now();
        //     let currentDate = null;
        //     do {
        //       currentDate = Date.now();
        //     } while (currentDate - date < milliseconds);
        // };
        // while (true) {
        //     console.log('Waiting OTP');
        //     const getOtp = await getOTP(apiKey, id)
        //     if (getOtp !== 'belom'){
        //         console.log('OTP Found :', getOtp);
        //         otp = getOtp
        //         break
        //     }
        //     sleep(5000)
        // }
        // rl.question('OTP : ', async (otp) => {
        //     const verifyOtp = await verifyOTP(otp, '87883280288')
        //     if (verifyOtp.status !== 200) {
        //         console.log('Wrong OTP or error!');
        //     } else {
        //         var fullName = await generateEmail()
        //         var fullName = fullName.split(' ')
        //         const email = fullName[0].toLowerCase() + fullName[1].toLowerCase() + '@labworld.org'
        //         const firstName = fullName[0]
        //         const lastName = fullName[1]
        //         const regis = await registration(email, firstName, lastName, '87883280288', otp)
        //         if (regis.status !== 200) {
        //             console.log(regis.message);
        //         } else {
        //             console.log(regis.message);
        //         }
        //     }

        // })
    // }
    fs.readFile('account.json', async (err, data) => {
        if (err) throw err;
        let account = JSON.parse(data);
        for (let i = 0; i <= account.length; i++) {
            console.log(account[i]);
            const email = account[i].email;
            const password = account[i].password;
            const login = await hitLogin(email, password)
            var accessToken;
            if (login.status !== 200) {
                console.log(login.message);
            } else {
                console.log('Success Login');
                accessToken = login.accessToken
                const sleep = (milliseconds) => {
                    const date = Date.now();
                    let currentDate = null;
                    do {
                    currentDate = Date.now();
                    } while (currentDate - date < milliseconds);
                };
                while (true) {
                    console.log('Waiting Email OTP');
                    sleep(3000)
                    try {
                        const emailList = await getEmailList(email);
                        const lastEmail = emailList[0]
                        const emailInbox = await getEmailInbox(lastEmail.id)
                        const $ = cheerio.load(emailInbox)
                        const emailOtpSearch = $('.strong').text().split(' ')[1]
                        if (emailOtpSearch !== undefined) {
                            console.log('Email OTP Found :', emailOtpSearch);
                            console.log('Try verify OTP');
                            const verifyEmail = await verifyEmailOtp(emailOtpSearch, accessToken)
                            if (verifyEmail.status === 200) {
                                console.log(verifyEmail.message);
                                accessToken = verifyEmail.accessToken
                                break;
                            } else {
                                console.log('Wrong OTP');
                                continue;
                            }
                        }
                    } catch (error) {
                        console.log(error.message);
                    }
                    
                    sleep(5000)
                }
                const cardNumber = await getCardNumber(accessToken, email)
                console.log('Starbuck card numbber :', cardNumber);
                const vochers = await getVocher(accessToken, cardNumber)
                vochers.forEach((vocher) => {
                    console.log('Vocher :', vocher.Reward);
                    console.log('Expired :', vocher.expiredDate);
                })
            }
        }
        
    });
    
})()