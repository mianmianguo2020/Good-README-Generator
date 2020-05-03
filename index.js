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


            inquirer
                .prompt(
                    {
                        type: 'list',
                        name: 'repo',
                        message: 'Which repo?',
                        choices: repoNameList,
                    },
                )
                .then(result => {
                    const selectedRepo = result.repo
                    const repoSelectedInfo = res.data.filter(repo => {
                        return repo.name == selectedRepo
                    })
                    console.log(repoSelectedInfo);


                    const allInfo = {
                        name: repoSelectedInfo[0].name,
                        image: repoSelectedInfo[0].owner.avatar_url,
                        repoLink: repoSelectedInfo[0].html_url,
                        descr: repoSelectedInfo[0].description,
                        license: repoSelectedInfo[0].license
                    }

                    const header = createMarkdown(allInfo);
                    fs.writeFileSync("ReadMe.md", header)
                    console.log("sucess!")

                })
        })
            .catch(err => { console.log("Get Request Errors: " + err) })

    });


const createMarkdown = (Info) => {
    const array = [];
    array.push("## " + Info.name)
    array.push("![Personel](" + Info.image + ")")
    array.push("[GitHub](" + Info.repoLink + ")")
    array.push("* " + Info.descr)

    if (Info.license != null) {
        array.push("# " + Info.license)
    } else {
        array.push("# This project is licensed under the XXX License")
    }


    return array.join("\n\n")
}