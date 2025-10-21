const DataRowState = {
    ADDED: 'ADDED',
    MODIFIED: 'MODIFIED',
    DELETED: 'DELETED',
    UNCHANGED: 'UNCHANGED'
};

// Utility methods for state management
DataRowState.isChanged = function(state) {
    return state === this.ADDED || state === this.MODIFIED || state === this.DELETED;
};

DataRowState.isUnchanged = function(state) {
    return state === this.UNCHANGED;
};

module.exports = DataRowState;