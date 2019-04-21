<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    #logo-box {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 130px;
        height: 130px;
        padding: 8px;
        border: 1px solid #eee;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 10px #eee;
        overflow: hidden;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
  }
}
</style>
