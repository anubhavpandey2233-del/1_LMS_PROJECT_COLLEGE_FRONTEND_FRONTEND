import { useState } from "react";

function useSerch(data, key) {
    const [Search, setSeach] = useState("");
    console.log(Search, data, key);

    const handleFilter = () => {
        return data?.filter((v) => 
            key.some((v1) => 
                typeof v[v1] === 'string' ?
                v[v1]?.toLowerCase()?.includes(Search?.toLowerCase()) :
                v[v1]?.toString()?.includes(Search)
        
            ))
    }

    const filterData = handleFilter()
    console.log(filterData);

    return {
        Search,
        setSeach,
        filterData
    }
}

export default useSerch;