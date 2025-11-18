import { useState } from "react";

function SearchChats({chats , onFilter}) {
   const [search , setSearch] = useState("");
   function handelSearch(event) {

    const value = event.target.value.trim();
    setSearch(value);

    if(!value) {
        onFilter(chats);
        return;
    }
    
    const filtred = chats.filter(chat=>chat.user.name.toLowerCase().includes(value.toLowerCase()));
    onFilter(filtred);
   }

    return (
        <div className="searchBox">
            <input type="text" placeholder="Search chats" className="searchInput" value={search} onChange={handelSearch}/>
        </div>
    );
}

export default SearchChats;