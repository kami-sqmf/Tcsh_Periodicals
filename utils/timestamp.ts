export const timestamp2Chinese = (timestamp: EpochTimeStamp) => {
  const date = new Date(timestamp * 1000);
  const amORpm = date.getHours() >= 12 ? "下午" : "上午";
  const numChinese = ["一", "二", "三", "四", "五", "六", "日"];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 週${numChinese[date.getDay() - 1]} ${amORpm}${date.getHours() % 12 || 12}時`
}

export const timestampBefrore = (oldTimestamp: EpochTimeStamp) => {
  const nowTimestamp = new Date().getTime();
  const diff = Math.floor((nowTimestamp - oldTimestamp) / 1000);
  if (diff < 60) return `${diff} 秒鐘前`
  else if (diff < 3600) return `${Math.floor(diff / 60)} 分鐘前`
  else if (diff < 86400) return `${Math.floor(diff / 3600)} 小時前`
  else return `${Math.floor(diff / 86400)} 天前`
}