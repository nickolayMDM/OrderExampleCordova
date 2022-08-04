const list = [
    {
        ID: 1,
        name: "",
        status: "guest",
    },
    {
        ID: 2,
        name: "Authorized account",
        status: "authorized",
    }
];

const getUserByID = (userID) => {
    for (let key in list) {
        if (!list.hasOwnProperty(key)) continue;

        if (list[key].ID === userID) {
            return list[key];
        }
    }

    return null;
};

export default {getUserByID};