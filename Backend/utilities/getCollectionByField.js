exports.getCollectionByField = async (field, value, collections, reqApp) => {
    for (var collection_object of collections) {
        const collection = collection_object.collection;
        try {
            const obj = await reqApp[collection].findOne({
                [field]: value
            });
            if (obj) {
                return {
                    collectionObj: obj,
                    collection: collection
                };
            }
        } catch (err) {
            console.log(err);
        }
    }
    return undefined;
};
