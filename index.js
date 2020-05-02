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

        axios.get(URL).then(res => {
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
                    
                    const repoSelectedInfo = res.data.filter(repo=>{
                        return repo.name==selectedRepo
                     })

                     const allInfo = {
                        name: repoSelectedInfo.name,
                        image: repoSelectedInfo.owner.avatar_url,
                        repoLink:repoSelectedInfo.html_url,
                        descr:repoSelectedInfo.description,
                        license:repoSelectedInfo.license
                     }
                     
                    fs.writeFileSync("ReadMe.md",allInfo)
                    console.log("sucess!")
                    

                     
                   
                    





                })
        })
        .error(err=>{console.log("Get Request Errors = =!!")})


    });






