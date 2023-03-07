const isIterableArray = data => {
    return !!data && Array.isArray(data) && !!data.length
}

module.exports = {
    isIterableArray
}

