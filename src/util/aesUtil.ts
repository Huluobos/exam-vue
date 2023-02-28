// @ts-ignore
import CryptoJS from 'crypto-js'

var AesUtil = function(this: any, keySize : number, iterationCount : number) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function(salt : string, passPhrase : string) {
    var key = CryptoJS.PBKDF2(
        passPhrase,
        CryptoJS.enc.Hex.parse(salt),
        { keySize: this.keySize, iterations: this.iterationCount });
    return key;
}

AesUtil.prototype.encrypt = function(salt : string, iv : string,
                                     passPhrase : string, plainText : string) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
        plainText,
        key,
        { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

AesUtil.prototype.decrypt = function(salt : string, iv : string,
                                     passPhrase : string, cipherText : string) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
        cipherParams,
        key,
        { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
}


var DL = "__bcdef567kop48__";

var secretKey =  new Date().getTime();

// @ts-ignore
function getArr6() {
    return [ 0, 1, 2, 3, 4, 5 ];
}

// @ts-ignore
function shuffle(arr: number[]) {
    return arr.sort(function() {
        return .5 - Math.random();
    });
}

// @ts-ignore
function getChar(n : number) {
    switch (n) {
        case 0:
            return 'a';
        case 1:
            return 'b';
        case 2:
            return 'c';
        case 3:
            return 'd';
        case 4:
            return 'e';
        case 5:
            return 'f';
    }
}

// @ts-ignore
function change(idxtemp) {
    var nidx = shuffle(getArr6());
    for (let i = 0; i < nidx.length / 2; i++) {
        idxtemp[nidx[i]] = getChar(idxtemp[nidx[i]]);
    }
    return idxtemp;
}

// @ts-ignore
function getCipherText(keys : any){
    var fst = "";
    var idx = shuffle(getArr6());
    for (let i = 0; i < idx.length; i++) {
        fst += (keys[idx[i]] + DL);
    }
    fst += change(idx);
    return fst;
}

// @ts-ignore
function hexfromdec(num : number) {
    if (num > 65535) {
        return ("err!")
    }
    let first = Math.round(num/4096 - .5);
    let temp1 = num - first * 4096;
    let second = Math.round(temp1/256 -.5);
    let temp2 = temp1 - second * 256;
    let third = Math.round(temp2/16 - .5);
    let fourth = temp2 - third * 16;
    return (""+getletter(third)+getletter(fourth));
}

// @ts-ignore
function getletter(num : number) {
    if (num < 10) {
        return num;
    } else {
        if (num == 10) {    return "A";     }
        if (num == 11) {    return "B";     }
        if (num == 12) {    return "C";     }
        if (num == 13) { 	 return "D";	 }
        if (num == 14) {	 return "E";     }
        if (num == 15) {	 return "F";     }
    }
}

// @ts-ignore
function encryptValue(x : string) {
    var hex=''; var i;
    for (i=0; i<x.length; i++)
    {
        hex += '%'+hexfromdec(x.charCodeAt(i))
    }
    return hex;
}

// @ts-ignore
export function encrypt(plainTextStr : string) {
    var randomNum = Math.random () + 0.3 // Adding 0.3 just for case if random number comes out as 0
    var str = Number(secretKey*randomNum).toString(16)+"";
    var encry = encryptValue(str);

    var ic = 1000;
    var ks = 128;

    var pp = encry;
    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);

    // @ts-ignore
    var aesUtil = new AesUtil(ks, ic);
    var ciphertext = aesUtil.encrypt(salt, iv, pp, plainTextStr);

    var finalStr =  getCipherText([ ciphertext, iv, salt, pp, ic, ks ]);

    return finalStr;
}
