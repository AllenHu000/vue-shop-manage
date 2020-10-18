export default function request(_this, url, params) {
  return new Promise((resolve, reject) => {
    const { data: res } = _this.$axios.get(url, { params })
    console.log(res)
  })
}
