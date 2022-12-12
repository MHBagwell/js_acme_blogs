//1.
function createElemWithText(createElement = "p", createTextContent = "", createClassName = "") {
    let element = document.createElement(createElement);
    element.textContent = createTextContent;
    if (createClassName) {
        element.className = createClassName;
    }
    return element;
}

//2.
function createSelectOptions(users) {
    if (users === undefined) return;
    let optionsElementsArray = [];
    for (let user of users) {
        let option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        optionsElementsArray.push(option);
    }
    return optionsElementsArray;

}

//3.
function toggleCommentSection(postId) {
    if (!postId) {
        return undefined;
    } else {
        let section = document.querySelector(`section[data-post-id="${postId}"]`);
        if (section) {
            section.classList.toggle('hide');
            return section;
        }
        return null;
    }
}

//4.
function toggleCommentButton(postId) {
    if (!postId) return;
    let buttonSelected = document.querySelector(`button[data-post-id="${postId}"]`);
    if (buttonSelected != null) {
        buttonSelected.textContent === "Show Comments" ? (buttonSelected.textContent = "Hide Comments") : (buttonSelected.textContent = "Show Comments");
    }
    return buttonSelected;
}

//5.
function deleteChildElements(parentElement) {
    if (!parentElement?.tagName) {
        return;
    } else {
        let child = parentElement.lastElementChild;
        while (child) {
            parentElement.removeChild(child);
            child = parentElement.lastElementChild;
        }
        return parentElement;
    }
}

//6.
function addButtonListeners() {
    let buttons = document.querySelectorAll('main button')
    buttons.forEach(button => {
        let postId = button.dataset.postId;
        button.addEventListener('click', () => {
            toggleComments(event, postId);
        });
    });
    return buttons;
}

//7.
function removeButtonListeners() {
    let mainElement = document.querySelector('main')
    let buttons = mainElement.querySelectorAll('button')

    if (buttons) {
        for (let i = 0; i < buttons.length; i++) {
            let myButton = buttons[i]
            let postId = myButton.dataset.postId
            myButton.removeEventListener('click', function (event) {
                toggleComments(event, postId), false
            })
        }
        return buttons
    }
}

//8.
function createComments(comment) {
    if (!comment) return;
    let frag = document.createDocumentFragment();
    for (let i = 0; i < comment.length; i++) {
        let article = document.createElement("article");
        let h3 = createElemWithText("h3", comment[i].name);
        let p1 = createElemWithText("p", comment[i].body);
        let p2 = createElemWithText("p", `From: ${comment[i].email}`);
        article.appendChild(h3);
        article.appendChild(p1);
        article.appendChild(p2);
        frag.appendChild(article);
    }
    return frag;
}

//9.
function populateSelectMenu(users) {
    if (!users) return;
    let menu = document.querySelector("#selectMenu");
    let options = createSelectOptions(users);

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        menu.append(option);
    }
    return menu;
}

//10.
let getUsers = async () => {
    let retrieve;
    try {
        retrieve = await fetch("https://jsonplaceholder.typicode.com/users");
    }
    catch (error) {
        console.log(error);
    }
    return await retrieve.json();

}

//11.
let getUserPosts = async (userId) => {
    if (!userId) return;
    let retrieve;
    try {
        retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
    }
    catch (error) {
        console.log(error);
    }
    return retrieve.json();
}

//12.
let getUser = async (userId) => {
    if (!userId) return;
    let retrieve;
    try {
        retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    }
    catch (error) {
        console.log(error);
    }
    return retrieve.json();
}

//13.
const getPostComments = async (postId) => {
    if (!postId) return;
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const jsonPostComments = await response.json();
        return jsonPostComments;
    } catch (error) {
        console.log(error);
    }
}

//14.
const displayComments = async (postId) => {
    if (!postId) return;
    let section = document.createElement("section");
    section.dataset.postId = postId;
    section.classList.add("comments", "hide");
    const comments = await getPostComments(postId);
    const fragment = createComments(comments);
    section.append(fragment);
    return section;
}

//15.
const createPosts = async (jsonPosts) => {
    if (!jsonPosts) return;

    let fragment = document.createDocumentFragment();

    for (let i = 0; i < jsonPosts.length; i++) {
        let post = jsonPosts[i];

        let article = document.createElement("article");
        let section = await displayComments(post.id);
        let author = await getUser(post.userId);

        let h2 = createElemWithText("h2", post.title);
        let p = createElemWithText("p", post.body);
        let p2 = createElemWithText("p", `Post ID: ${post.id}`);

        let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
        let p4 = createElemWithText("p", `${author.company.catchPhrase}`);

        let button = createElemWithText("button", "Show Comments");
        button.dataset.postId = post.id;

        article.append(h2, p, p2, p3, p4, button, section);

        fragment.append(article);
    }
    return fragment;
};

//16.
const displayPosts = async (posts) => {
    let myMain = document.querySelector("main");
    let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
    myMain.append(element);
    return element;
}

//17.
let toggleComments = (event, postID) => {
    if (!event || !postID) return;
    event.target.listener = true;
    let section = toggleCommentSection(postID);
    let button = toggleCommentButton(postID);
    return [section, button];
};

//18.
const refreshPosts = async (posts) => {
    if (!posts) return;
    let buttons = removeButtonListeners();
    let myMain = deleteChildElements(document.querySelector("main"));
    let fragment = await displayPosts(posts);
    let button = addButtonListeners();
    return [buttons, myMain, fragment, button];
}

//19.
const selectMenuChangeEventHandler = async (e) => {
    if (!e) return;
    let userId = e?.target?.value || 1;
    let posts = await getUserPosts(userId);
    let refreshPostsArray = await refreshPosts(posts);
    return [userId, posts, refreshPostsArray];
}

//20.
const initPage = async () => {
    let users = await getUsers();
    let select = populateSelectMenu(users);
    return [users, select];
}


//21.
function initApp() {
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", initApp, false);
