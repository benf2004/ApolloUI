import Post, {UserActions} from "./postClasses.js";

const post = new Post("Testing", "", "Save3rdPartyApps", "Toptomcat",
    1300, 0, 120, 48, "img", `https://i.redd.it/nd8kudvjhw5b1.png`,
    "", new UserActions())

post.createLargeThumbnail()