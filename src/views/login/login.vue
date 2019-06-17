<template>
  <div class="login-container">
    <div class="login-card">
      <div class="block">
        <el-carousel height="625px">
          <el-carousel-item v-for="item in slides" :key="item.link">
            <a :href="item.link">
              <div class="slide" :style="{backgroundImage:'url(' + item.background + ')'}"></div>
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="left"
      >
        <div class="title">
          <img src="https://www.bookln.cn/home/assets/img/common/new-logo.png" alt>
        </div>

        <div class="third-login">
          <div class="login-name">第三方登陆</div>
          <svg-icon icon-class="wechat"/>
          <svg-icon icon-class="qq"/>
        </div>

        <div class="account-login">
          <label class="username-label form" for="username">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            @focus="focusUsername"
            @blur="blurUsername"
          >
          <div class="bottom-line" style="width: 0px;"></div>
          <label class="password-label form" for="password">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            @focus="focusPassword"
            @blur="blurPassword"
            @keyup.enter.native="handleLogin"
          >
          <div class="bottom-line" style="width: 0px;"></div>
        </div>
        <div class="login">
          <el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
          <el-button class="login-button" type="primary" @click.native.prevent="handleLogin">登陆</el-button>
        </div>
        <div class="forgot">忘记密码?</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: null,
        password: null
      },

      slides: [
        {
          link: 'https://www.baidu.com?search=1',
          background: 'http://cdn10.bookln.cn/182480_2613482FA300616ECF02879AB8BFF21F.jpg'
        },
        {
          link: 'https://www.baidu.com?s',
          background: 'http://cdn10.bookln.cn/182480_875F321D3D5E138130870D8A5C4EF421.jpg'
        },
        {
          link: 'https://www.baidu.com',
          background: 'http://cdn10.bookln.cn/1815649_960215BDF7C74FABDBB5001E35715064.png'
        }
      ],

      checked: false,

      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },

      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },

  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },

  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },

  methods: {

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // dispatch到store模块下 ‘user/login’ 函数
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },

    focusUsername() {
      const usernameLabel = this.$el.getElementsByClassName('username-label')[0]
      usernameLabel.style.animation = 'input-focus 0.2s'
      usernameLabel.style.top = '5px'
    },

    blurUsername() {
      const usernameLabel = this.$el.getElementsByClassName('username-label')[0]
      if (this.loginForm.username === null || this.loginForm.username === '') {
        usernameLabel.style.animation = 'input-blur 0.2s'
        usernameLabel.style.top = '30px'
      }
    },

    focusPassword() {
      const passwordLabel = this.$el.getElementsByClassName('password-label')[0]
      passwordLabel.style.animation = 'input-focus 0.2s'
      passwordLabel.style.top = '5px'
    },

    blurPassword() {
      const passwordLabel = this.$el.getElementsByClassName('password-label')[0]
      if (this.loginForm.password === null || this.loginForm.password === '') {
        passwordLabel.style.animation = 'input-blur 0.2s'
        passwordLabel.style.top = '30px'
      }
    }

    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }

}
</script>

<style lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .login-card {
    width: 60%;
    height: 625px;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 65% 35%;
    grid-template-areas: "block form";
    box-shadow: 5px 10px 40px #d3dce6;

    .login-form {
      grid-area: form;
      width: 40%;
      height: 100%;
      margin: 20px;
      display: grid;
      grid-template-rows: 10% 10% 20% 20% 10% 20% 10%;
      grid-template-areas: "." "title" "third" "input" "login" "forgot" ".";
      .title {
        grid-area: title;
        margin: auto;
        img {
          width: 120px;
          margin-bottom: 45px;
          vertical-align: middle;
          max-width: 100%;
        }
      }

      .login {
        grid-area: login;
        margin-left: 20px;
        .remember {
          width: 100%;
          text-align: left;
          color: gray;
          font-weight: 200;
          margin: 5px 0 0 0;
        }

        .login-button {
          width: 93%;
          margin-top: 20px;
          margin-bottom: 10px;
          height: 35px;
          padding: 5px;
          font-size: 18px;
          font-weight: 500;
        }
      }

      .third-login {
        grid-area: third;
        margin: auto;
        .login-name {
          text-align: center;
        }
        svg {
          width: 40px;
          height: 40px;
          margin: 10px;
        }
      }

      .account-login {
        grid-area: input;
      }

      .forgot {
        text-align: right;
        grid-area: forgot;
        margin: 20px;
        margin-top: 30px;
        font-size: 10pt;
        color: #46a6ff;
        font-weight: 200;
        text-decoration: underline;
      }
    }

    .block {
      grid-area: block;
      width: 100%;
      height: 100%;
    }
  }
}

.slide {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}

input {
  font-size: 16px !important;
  font-family: SourceHanSansCN-Regular;
  font-weight: 400;
  color: #333;
  line-height: 24px;
  outline: 0 !important;
  border: none !important;
  box-shadow: none !important;
  border-bottom: 1px solid #eaeaea !important;
  border-radius: 0 !important;
  padding: 5px 0px !important;
  width: 250px;
  margin: 0 20px;
}

input:focus {
  border-bottom: 1px solid #1890ff !important;
}

@keyframes input-focus {
  from {
    top: 30px;
  }
  to {
    top: 5px;
  }
}

@keyframes input-blur {
  from {
    top: 5px;
  }
  to {
    top: 30px;
  }
}

.bottom-line {
  width: 250px;
  position: relative;
  width: 0;
  height: 1px;
  left: 20px;
  background-color: #48abff;
}

.form {
  font-size: 13px;
  position: relative;
  left: 20px;
  top: 30px;
  color: #999;
  line-height: 21px;
  font-weight: 400;
  margin-left: 0;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  box-shadow: 0 0 0 1000px white inset !important;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  margin: 0;
}

.el-input {
  border: none;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
