import "./searchInputStyle.css";
import { useState } from "react";

function SearchChats({ chats, onFilter }) {
    const [search, setSearch] = useState("");
    function handleSearch(event) {

        const value = event.target.value; // Don't trim immediately to allow typing space
        setSearch(value);

        if (!value.trim()) {
            onFilter(chats);
            return;
        }

        const filtered = chats.filter(chat => chat.user.name.toLowerCase().includes(value.trim().toLowerCase()));
        onFilter(filtered);
    }

    return (
        <div className="searchBox">
            <input type="text" placeholder="Search chats" className="searchInput" value={search} onChange={handleSearch} />
        </div>
    );
}

export default SearchChats;