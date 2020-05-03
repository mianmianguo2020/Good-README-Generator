const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");


const questionsList = [
    { message: "Enter your GitHub username", name: "username" },
    // { message: "", name: "username1" },
    // { message: "question3", name: "username3" },
]


inquirer
    .prompt(questionsList).then(result => {
        const userUsername = result.username
        const URL = "https://api.github.com/users/" + userUsername + "/repos?per_page=100"


        axios.get(URL, { auth: { username: 'mianmianguo2020', password: process.env.PERSONALACCESSTOKEN } }).then(res => {
            const repoNameList = [];
            for (let repo of res.data) {
                repoNameList.push(repo.name);
            }

            const questionList2 = [
                {
                    type: 'list',
                    name: 'repo',
                    message: 'Which repo?',
                    choices: repoNameList,
                },
                {
                    message: "Installation of the project",
                    name: "Installation"
                },
                {
                    message: "Author of the project",
                    name: "Author"
                },
                {
                    message: "what's your email",
                    name: "email"
                },

                {
                    message: "Usage of the project",
                    name: "Usage"
                },

                {
                    message: "Contributor of the project",
                    name: "Contributor"
                },
            ]


            const URL2 = "https://api.github.com/users/" + userUsername
            axios.get(URL2, { auth: { username: 'mianmianguo2020', password: process.env.PERSONALACCESSTOKEN } })
                .then(response => {
                    console.log(response.data)

                    inquirer
                        .prompt(questionList2)

                        .then(result => {
                            const selectedRepo = result.repo
                            const repoSelectedInfo = res.data.filter(repo => {
                                return repo.name == selectedRepo
                            })
                            // console.log(repoSelectedInfo);

                            let Author = result.Author 

                            if (Author == null) {
                                Author = response.data.login                              
                            }


                            let email = result.email

                            if (email == null) {
                                email = response.email
                            } 
                            if (email == null) {
                                email = "User Email informaton is not public"
                            } 

                            let bioInfo = response.data.bio

                            const allInfo = {
                                name: repoSelectedInfo[0].name,
                                author:Author,
                                image: repoSelectedInfo[0].owner.avatar_url,
                                repoLink: repoSelectedInfo[0].html_url,
                                descr: repoSelectedInfo[0].description,
                                license: repoSelectedInfo[0].license,
                                emailInfo: email,
                                Installation:result.Installation,
                                Usage:result.Usage,
                                contributor:result.Contributor,
                                bioInfo:bioInfo
                            }


                            const mainContent = createMarkdown(allInfo);
                            fs.writeFileSync("ReadMe.md", mainContent)
                            console.log("sucess!")

                        })
                })


        })
            .catch(err => { console.log("Get Request Errors: " + err) })

    });


const createMarkdown = (Info) => {
    const array = [];
    array.push("## Project-Title:")
    array.push(Info.name)
    
    array.push("## Installation:")
    array.push("\`\`\` " + Info.Installation + "\`\`\` ")    

    array.push("## Author:")
    array.push(Info.author)
    array.push(Info.bioInfo)
    array.push("![Personel](" + Info.image + ")")
    
    array.push("## Table of Contents:")
    array.push("* Usage")
    array.push("* License")
    array.push("* Contributors")
    array.push("* Questions")

    array.push("## Usage:")
    array.push(Info.Usage)

    array.push("## License:")
    if (Info.license != null) {
        array.push(Info.license)
    } else {
        array.push("License information is not available.")
    }

    array.push("## Contributors:")
    array.push(Info.contributor)

    array.push("## Questions:")
    array.push("if you have question please contact " + Info.emailInfo )

    return array.join("\n\n")
}