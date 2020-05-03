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
        // console.log(`${result.username}`,`${result.username1}`,`${result.username3}`)

        axios.get(URL, {auth: {username: 'mianmianguo2020',password: process.env.PERSONALACCESSTOKEN}}).then(res => {
            // const repoName = res.data.name;
            // console.log(res.data)
            // console.log(res.data.name)
            const repoNameList = [];
            for (let repo of res.data) {
                repoNameList.push(repo.name);//just push the repo name 
            }
            // console.log(repoList)

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
                    // console.log(result);
                    const selectedRepo = result.repo
                    // console.log(selectedRepo);
                    // console.log(res.data);
                    
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
                    fs.writeFileSync("ReadMe.md", JSON.stringify(allInfo,null,2))
                    fs.writeFileSync("ReadMe.md", header)
                    console.log("sucess!")

                })
        })
            .catch(err => { console.log("Get Request Errors: " + err) })

    });


const createMarkdown = (Info)=> {

const header = "#" + Info.name
const imageDisplay = "![Personel](" + Info.image + ")"
const repoLinkDisplay = "[GitHub](" + Info.repoLink + ")"
const descrDisplay = "#" + Info.descr
const licenseDisplay = "#" + Info.license

return header+'\n'+imageDisplay+'\n'+repoLinkDisplay+'\n'+descrDisplay+'\n'+licenseDisplay
}