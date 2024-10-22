export const formatSTX = (amount) => {
    return (amount / 1000000).toFixed(2);
  };
  
  export const formatDate = (blockHeight) => {
    const date = new Date(blockHeight * 10 * 60 * 1000);
    return date.toLocaleDateString();
  };
  