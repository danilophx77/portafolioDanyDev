export default function validator(inputs){
    const isPhoneNumbers = /^[0-9]+$/
    console.log(inputs)
    if(inputs.phone.match(isPhoneNumbers)){
        console.log(inputs.phone)
    }
}