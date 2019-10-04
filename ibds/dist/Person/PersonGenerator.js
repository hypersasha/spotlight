"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var Promise = require('bluebird');
var MaxNumbersOfTry = 4;
var PersonGenerator = /** @class */ (function () {
    function PersonGenerator() {
    }
    /**
     * @description generation persons with fake information
     * @param options.count:number - number of persons
     * @param options.rndNumMin:number - minimum threshold of random number
     * @param options.rndNumMax:number - maximum threshold of random number
     * @param options.bigTextParagraphs:number - number of paragraphs in random text for one person. (Full text of article)
     *                                          Total number of paragraphs should not exceed 500
     * @param options.mediumTextSentences:number - number of sentences in random text for one person. (Preview text of article)
     *                                          Total number of sentences should not exceed 500
     * @param options.smallTextSentences:number - number of sentences in random text for one person. (Text of comment in article)
     *                                          Total number of sentences should not exceed 500
     * @param options.pictureWidth:number - width of generated image
     * @param options.pictureHeight:number - height of generated image
     *
     * @returns array:IPerson[]
     */
    PersonGenerator.prototype.getPersons = function (options) {
        return new Promise(function (res, rej) {
            if (options.count < 1)
                options.count = 1;
            if (options.rndNumMin < 0)
                options.rndNumMin = 0;
            if (options.rndNumMax < 0)
                options.rndNumMax = 0;
            if (options.rndNumMax < options.rndNumMin)
                options.rndNumMax = options.rndNumMin;
            if (options.bigTextParagraphs < 1)
                options.bigTextParagraphs = 1;
            console.log('Getting person information...');
            return Promise.mapSeries(new Array(options.count), function () { return PersonGenerator._getPersonInformation(0, options.rndNumMin, options.rndNumMax); })
                .then(function (allPersons) {
                var genders = [
                    {
                        gender: 'male',
                        number: 0
                    },
                    {
                        gender: 'female',
                        number: 0
                    }
                ];
                var male = [], female = [];
                allPersons.map(function (person) {
                    if (person.gender === 'female') {
                        female.push(person);
                        genders[1].number++;
                    }
                    else {
                        male.push(person);
                        genders[0].number++;
                    }
                });
                console.log('Getting photo and russian name...');
                return Promise.mapSeries(genders, function (gender) { return PersonGenerator._getRightNameAndPhoto(0, gender); })
                    .then(function (informations) {
                    allPersons = PersonGenerator._getRightNameAndPhoto_sort(male, female, informations);
                    var mediumTextSentencesMultiplier = 1;
                    // TODO: Gulp ругается если поставить let и сделать объект. Почему?
                    var seriesText;
                    (function (seriesText) {
                        seriesText[seriesText["small"] = options.smallTextSentences * options.count] = "small";
                        seriesText[seriesText["medium"] = options.mediumTextSentences * options.count * mediumTextSentencesMultiplier] = "medium";
                        seriesText[seriesText["big"] = options.bigTextParagraphs * options.count] = "big";
                    })(seriesText || (seriesText = {}));
                    return Promise.mapSeries(Object.keys(seriesText).filter(function (k) { return typeof seriesText[k] === "number"; }), function (typeText) { return PersonGenerator._getText(typeText, seriesText[typeText]); })
                        .then(function (result) {
                        var texts = Object.assign(result[0], result[1], result[2]);
                        Object.keys(allPersons).map(function (index) {
                            for (var i = 0; i < (options.smallTextSentences); i++) {
                                allPersons[+index].smallText.push(texts.small[0]);
                                texts.small.shift();
                            }
                            for (var i = 0; i < (options.mediumTextSentences * mediumTextSentencesMultiplier); i++) {
                                allPersons[+index].mediumText.push(texts.medium[0]);
                                texts.medium.shift();
                            }
                            for (var i = 0; i < options.bigTextParagraphs; i++) {
                                allPersons[+index].bigText.push(texts.big[0]);
                                texts.big.shift();
                            }
                            allPersons[+index].smallText = allPersons[+index].smallText.filter(Boolean);
                            allPersons[+index].mediumText = allPersons[+index].mediumText.filter(Boolean);
                            allPersons[+index].bigText = allPersons[+index].bigText.filter(Boolean);
                        });
                        console.log('Getting picture...');
                        return Promise.mapSeries(new Array(options.count), function () { return PersonGenerator._getPicture(0, options.pictureWidth, options.pictureHeight); })
                            .then(function (result) {
                            Object.keys(allPersons).map(function (index) {
                                allPersons[+index].picture = result[+index];
                            });
                            return res(allPersons);
                        })
                            .catch(function (err) { return rej(err); });
                    })
                        .catch(function (err) { return rej(err); });
                })
                    .catch(function (err) { return rej(err); });
            })
                .catch(function (err) { return rej(err); });
        });
    };
    PersonGenerator._getPersonInformation = function (NumberOfTry, rndNumMin, rndNumMax) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (NumberOfTry >= MaxNumbersOfTry) {
                reject(new Error('Exceeded number of try in "_getPersonInformation" method'));
                return;
            }
            request({
                url: 'https://api.namefake.com/russian-russia/random',
                // У сайта нет ssl, поэтому приходится выключать защиту
                rejectUnauthorized: false
            }, function (err, res, body) {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', "Error in '_getPersonInformation' method: " + err.code + ". \nTrying to get it again...");
                    _this._getPersonInformation((NumberOfTry + 1), rndNumMin, rndNumMax)
                        .then(function (result) { return resolve(result); })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    var success = true;
                    try {
                        JSON.parse(body);
                    }
                    catch (e) {
                        console.log('\x1b[33m%s\x1b[0m', "Error in '_getPersonInformation' method during try parse body: " + e.message + ". \nTrying to get it again...");
                        success = false;
                        _this._getPersonInformation((NumberOfTry + 1), rndNumMin, rndNumMax)
                            .then(function (result) { return resolve(result); })
                            .catch(function (err) { return reject(err); });
                    }
                    if (success) {
                        var info = JSON.parse(body);
                        var person = {
                            gender: (info.pict.includes('female') ? 'female' : 'male'),
                            firstName: "",
                            secondName: "",
                            address: {
                                index: info.address.split(', ')[0],
                                region: info.address.split(', ')[1],
                                city: info.address.split(', ')[2],
                                street: info.address.split(', ')[3],
                                house: info.address.split(', ')[4]
                            },
                            age: _this._getPersonAge(info.birth_data),
                            birthday: {
                                year: info.birth_data.split('-')[0],
                                month: info.birth_data.split('-')[1],
                                day: info.birth_data.split('-')[2]
                            },
                            phone: info.phone_h,
                            email: info.email_u + '@' + info.email_d,
                            username: info.username,
                            workCompany: info.company,
                            photo: '',
                            smallText: [''],
                            mediumText: [''],
                            bigText: [''],
                            rndNumber: Math.round(rndNumMin - 0.5 + Math.random() * (rndNumMax - rndNumMin + 1)),
                            picture: ''
                        };
                        resolve(person);
                    }
                }
            });
        });
    };
    PersonGenerator._getPersonAge = function (date) {
        var _year = parseInt(date.split('-')[0]);
        var _month = parseInt(date.split('-')[1]);
        var _day = parseInt(date.split('-')[2]);
        var today = new Date();
        var birthday = new Date(_year, _month - 1, _day);
        var differenceInMilisecond = today.valueOf() - birthday.valueOf();
        return Math.floor(differenceInMilisecond / 31536000000);
    };
    PersonGenerator._getRightNameAndPhoto = function (NumberOfTry, gender) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (NumberOfTry >= MaxNumbersOfTry) {
                reject(new Error('Exceeded number of try in "_getRightNameAndPhoto" method'));
                return;
            }
            if (gender.number === 0) {
                resolve();
                return;
            }
            request({
                url: 'https://uinames.com/api/?amount=' + gender.number + '&gender=' + gender.gender + '&region=russia&ext',
            }, function (err, res, body) {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', "Error in '_getRightNameAndPhoto' method: " + err.code + ". \nTrying to get it again...");
                    _this._getRightNameAndPhoto((NumberOfTry + 1), gender)
                        .then(function (result) { return resolve(result); })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    var success = true;
                    try {
                        JSON.parse(body);
                    }
                    catch (e) {
                        console.log('\x1b[33m%s\x1b[0m', "Error in '_getRightNameAndPhoto' method during try parse body: " + e.message + ". \nTrying to get it again...");
                        success = false;
                        _this._getRightNameAndPhoto((NumberOfTry + 1), gender)
                            .then(function (result) { return resolve(result); })
                            .catch(function (err) { return reject(err); });
                    }
                    if (success) {
                        var persons = void 0;
                        // Если запрос отправлен на одного человека, то приходит JSON, иначе массив из JSON
                        if (Array.isArray(JSON.parse(body))) {
                            persons = JSON.parse(body).map(function (person) {
                                return {
                                    photo: person.photo,
                                    firstName: person.name,
                                    secondName: person.surname
                                };
                            });
                        }
                        else {
                            persons = [{
                                    photo: JSON.parse(body).photo,
                                    firstName: JSON.parse(body).name,
                                    secondName: JSON.parse(body).surname
                                }];
                        }
                        resolve(persons);
                    }
                }
            });
        });
    };
    PersonGenerator._getRightNameAndPhoto_sort = function (male, female, informations) {
        informations.map(function (gender, genderIndex) {
            if (genderIndex === 0 && gender) {
                gender.map(function (info, index) {
                    male[index].photo = info.photo;
                    male[index].firstName = info.firstName;
                    male[index].secondName = info.secondName;
                });
            }
            else if (genderIndex === 1 && gender) {
                gender.map(function (info, index) {
                    female[index].photo = info.photo;
                    female[index].firstName = info.firstName;
                    female[index].secondName = info.secondName;
                });
            }
        });
        return male.concat(female);
    };
    PersonGenerator._getText = function (type, number) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            switch (type) {
                case 'small':
                    console.log('Getting ' + number + ' sentences for small text...');
                    _this._getSmallText(0, number)
                        .then(function (result) {
                        resolve(result);
                    })
                        .catch(function (err) { return reject(err); });
                    break;
                case 'medium':
                    console.log('Getting ' + number + ' sentences for medium text...');
                    _this._getMediumText(0, number)
                        .then(function (result) {
                        resolve(result);
                    })
                        .catch(function (err) { return reject(err); });
                    break;
                case 'big':
                    console.log('Getting ' + number + ' paragraphs for big text...');
                    _this._getBigText(0, number)
                        .then(function (result) {
                        resolve(result);
                    })
                        .catch(function (err) { return reject(err); });
                    break;
            }
        });
    };
    PersonGenerator._getSmallText = function (NumberOfTry, sentences) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (NumberOfTry >= MaxNumbersOfTry) {
                reject(new Error('Exceeded number of try in "_getSmallText" method'));
                return;
            }
            request({
                url: 'https://fish-text.ru/get?type=sentence&format=json&number=' + sentences,
            }, function (err, res, body) {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', "Error in '_getSmallText' method: " + err.code + ". \nTrying to get it again...");
                    _this._getSmallText((NumberOfTry + 1), sentences)
                        .then(function (result) { return resolve(result); })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    var success = true;
                    try {
                        JSON.parse(body);
                    }
                    catch (e) {
                        console.log('\x1b[33m%s\x1b[0m', "Error in '_getSmallText' method during try parse body: " + e.message + ". \nTrying to get it again...");
                        success = false;
                    }
                    if (success) {
                        resolve({ small: JSON.parse(body).text.split('.').filter(Boolean) });
                    }
                }
            });
        });
    };
    PersonGenerator._getMediumText = function (NumberOfTry, sentences) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (NumberOfTry >= MaxNumbersOfTry) {
                reject(new Error('Exceeded number of try in "_getMediumText" method'));
                return;
            }
            request({
                url: 'https://fish-text.ru/get?type=sentence&format=json&number=' + sentences,
            }, function (err, res, body) {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', "Error in '_getSmallText' method: " + err.code + ". \nTrying to get it again...");
                    _this._getMediumText((NumberOfTry + 1), sentences)
                        .then(function (result) { return resolve(result); })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    var success = true;
                    try {
                        JSON.parse(body);
                    }
                    catch (e) {
                        console.log('\x1b[33m%s\x1b[0m', "Error in '_getMediumText' method during try parse body: " + e.message + ". \nTrying to get it again...");
                        success = false;
                    }
                    if (success) {
                        resolve({ medium: JSON.parse(body).text.split('.').filter(Boolean) });
                    }
                }
            });
        });
    };
    PersonGenerator._getBigText = function (NumberOfTry, paragraphs) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (NumberOfTry >= MaxNumbersOfTry) {
                reject(new Error('Exceeded number of try in "_getBigText" method'));
                return;
            }
            request({
                url: 'https://fish-text.ru/get?type=paragraph&format=json&number=' + paragraphs,
            }, function (err, res, body) {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', "Error in '_getBigText' method: " + err.code + ". \nTrying to get it again...");
                    _this._getBigText((NumberOfTry + 1), paragraphs)
                        .then(function (result) { return resolve(result); })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    var success = true;
                    try {
                        JSON.parse(body);
                    }
                    catch (e) {
                        console.log('\x1b[33m%s\x1b[0m', "Error in '_getBigText' method during try parse body: " + e.message + ". \nTrying to get it again...");
                        success = false;
                    }
                    if (success) {
                        resolve({ big: JSON.parse(body).text.split('\\n').filter(Boolean) });
                    }
                }
            });
        });
    };
    PersonGenerator._getPicture = function (NumberOfTry, pictureWidth, pictureHeight) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (NumberOfTry >= MaxNumbersOfTry) {
                reject(new Error('Exceeded number of try in "_getPicture" method'));
                return;
            }
            var url = 'https://picsum.photos/' + pictureWidth + '/' + pictureHeight + '.jpg';
            request({ url: url }, function (err, res) {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', "Error in '_getPicture' method: " + err.code + ". \nTrying to get it again...");
                    _this._getPicture((NumberOfTry + 1), pictureWidth, pictureHeight)
                        .then(function (result) { return resolve(result); })
                        .catch(function (err) { return reject(err); });
                }
                else {
                    resolve(res.request.uri.href);
                }
            });
        });
    };
    return PersonGenerator;
}());
exports.PersonGenerator = PersonGenerator;
