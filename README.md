# ws-scrcpy

基于 WebSocket 的 [scrcpy](https://github.com/Genymobile/scrcpy) Web 客户端，支持在浏览器中远程控制 Android 设备。

本项目是 [NetrisTV/ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy) 的 fork 版本，将 scrcpy-server 升级到基于官方 scrcpy v3.1 版本。

## 项目简介

ws-scrcpy 是一个允许你通过 Web 浏览器远程查看和控制 Android 设备的工具。它使用修改版的 scrcpy-server 通过 WebSocket 协议传输 H.264 视频流，并在浏览器中使用多种解码器进行解码显示。

### 主要特性

- **屏幕投射**: 实时查看 Android 设备屏幕
- **远程控制**: 支持触摸、键盘、鼠标操作
- **多种解码器**: MSE Player、Broadway Player、TinyH264 Player、WebCodecs Player
- **文件管理**: 拖拽上传 APK、文件浏览和下载
- **远程 Shell**: 在浏览器中使用 adb shell
- **DevTools**: 调试设备上的 WebView

## 系统要求

### 浏览器要求
- WebSocket 支持
- Media Source Extensions (MSE) 和 H.264 解码支持
- WebWorkers 支持
- WebAssembly 支持

### 服务器要求
- Node.js v16+
- node-gyp ([安装指南](https://github.com/nodejs/node-gyp#installation))
- `adb` 可执行文件必须在 PATH 环境变量中

### 构建 scrcpy-server 要求
- Java JDK 17+
- Android SDK (API 36)
- Gradle

### 设备要求
- Android 5.0+ (API 21+)
- 已启用 [USB 调试](https://developer.android.com/studio/command-line/adb.html#Enabling)
- 部分设备需要启用[额外选项](https://github.com/Genymobile/scrcpy/issues/70#issuecomment-373286323)以支持键鼠控制

## 项目结构

```
ws-scrcpy/
├── src/                          # 前端和后端源代码
│   ├── app/                      # 前端应用代码
│   │   ├── player/               # 视频播放器实现
│   │   ├── controlMessage/       # 控制消息定义
│   │   └── ...
│   └── server/                   # Node.js 服务器代码
├── vendor/                       # 第三方依赖
│   └── Genymobile/scrcpy/        # scrcpy-server 子模块 (websocket 分支)
├── dist/                         # 构建输出目录
├── webpack/                      # Webpack 配置
└── docs/                         # 文档
```

## 快速开始

### 1. 克隆仓库

```bash
git clone --recursive https://github.com/EucalyZ/ws-scrcpy.git
cd ws-scrcpy
```

如果已经克隆但没有子模块，执行：
```bash
git submodule update --init --recursive
```

### 2. 构建 scrcpy-server

#### 2.1 配置 Android SDK

在 `vendor/Genymobile/scrcpy/` 目录下创建 `local.properties` 文件：

```properties
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

或者设置环境变量：
```bash
# Windows
set ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk

# Linux/macOS
export ANDROID_HOME=$HOME/Android/Sdk
```

#### 2.2 构建 server

```bash
cd vendor/Genymobile/scrcpy

# Windows
.\gradlew.bat assembleDebug

# Linux/macOS
./gradlew assembleDebug
```

#### 2.3 复制构建产物

```bash
cp server/build/outputs/apk/debug/server-debug.apk server/scrcpy-server
```

### 3. 安装依赖并启动

```bash
cd ws-scrcpy  # 回到项目根目录
npm install -g node-gyp

sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.13

npm install events --save-dev
npm install
npm start
```

服务启动后，在浏览器中访问 `http://localhost:8000`

## 详细配置

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `WS_SCRCPY_CONFIG` | 配置文件路径 | - |
| `WS_SCRCPY_PATHNAME` | URL 路径前缀 | `/` |

### 配置文件

配置文件格式参考: [config.example.yaml](config.example.yaml)

```yaml
server:
  port: 8000
  hostname: "0.0.0.0"

# HTTPS 配置 (可选)
ssl:
  pemCertPath: "/path/to/cert.pem"
  pemKeyPath: "/path/to/key.pem"
```

### 自定义构建

通过修改 [build.config.override.json](build.config.override.json) 自定义构建：

```json
{
  "INCLUDE_APPL": false,
  "INCLUDE_GOOG": true,
  "INCLUDE_ADB_SHELL": true,
  "INCLUDE_DEV_TOOLS": true,
  "INCLUDE_FILE_LISTING": true,
  "USE_BROADWAY": true,
  "USE_H264_CONVERTER": true,
  "USE_TINY_H264": true,
  "USE_WEBCODECS": true,
  "SCRCPY_LISTENS_ON_ALL_INTERFACES": true
}
```

| 选项 | 说明 |
|------|------|
| `INCLUDE_APPL` | 包含 iOS 设备支持 |
| `INCLUDE_GOOG` | 包含 Android 设备支持 |
| `INCLUDE_ADB_SHELL` | 包含远程 Shell 功能 |
| `INCLUDE_DEV_TOOLS` | 包含 DevTools 功能 |
| `INCLUDE_FILE_LISTING` | 包含文件管理功能 |
| `USE_BROADWAY` | 包含 Broadway 解码器 |
| `USE_H264_CONVERTER` | 包含 MSE 播放器 |
| `USE_TINY_H264` | 包含 TinyH264 解码器 |
| `USE_WEBCODECS` | 包含 WebCodecs 播放器 |
| `SCRCPY_LISTENS_ON_ALL_INTERFACES` | WebSocket 服务器监听所有接口 |

## 视频播放器说明

### MSE Player (推荐)
- 基于 [xevokk/h264-converter](https://github.com/xevokk/h264-converter)
- 使用 HTML5 Video 和 Media Source API
- 可能使用硬件加速，性能最佳

### Broadway Player
- 基于 [mbebenita/Broadway](https://github.com/mbebenita/Broadway)
- WebAssembly 软件解码器
- 兼容性好，但 CPU 占用较高

### TinyH264 Player
- 基于 [udevbe/tinyh264](https://github.com/udevbe/tinyh264)
- Broadway 的优化版本
- 使用 WebWorker 进行解码

### WebCodecs Player
- 使用浏览器内置解码器
- 仅 Chromium 系浏览器支持
- 性能优秀

## 使用说明

### 连接设备

1. 确保设备已通过 USB 连接并启用 USB 调试
2. 运行 `adb devices` 确认设备已识别
3. 启动 ws-scrcpy 服务器
4. 在浏览器中打开 `http://localhost:8000`
5. 选择设备和播放器类型

### 远程控制

- **触摸**: 直接在视频画面上点击/滑动
- **多点触控模拟**:
  - `Ctrl` + 点击: 以屏幕中心为对称点
  - `Shift` + `Ctrl` + 点击: 以当前点为对称点
- **滚动**: 鼠标滚轮或触控板
- **键盘**: 直接输入，支持快捷键
- **粘贴**: 支持剪贴板同步

### 文件传输

- 拖拽 APK 文件到视频画面可上传到 `/data/local/tmp`
- 使用文件管理器浏览、上传、下载文件

## 开发

### 开发模式

```bash
npm run dist:dev
```

### 生产构建

```bash
npm run dist:prod
```

### 代码检查

```bash
npm run lint
npm run format
```

## 已知问题

- Android 模拟器上的服务器监听内部接口，需要选择 "proxy over adb"
- TinyH264Player 可能启动失败，刷新页面重试
- Safari 上文件上传不显示进度

## 安全警告

- 浏览器与 Node.js 服务器之间默认无加密（可配置 HTTPS）
- 浏览器与 Android 设备上的 WebSocket 服务器之间无加密
- 无任何级别的授权验证
- scrcpy-server 会监听所有网络接口
- 最后一个客户端断开后 scrcpy-server 会继续运行

**建议**: 仅在受信任的网络环境中使用，或配置 HTTPS 和防火墙规则。

## 相关项目

- [Genymobile/scrcpy](https://github.com/Genymobile/scrcpy) - 原版 scrcpy
- [NetrisTV/ws-scrcpy](https://github.com/NetrisTV/ws-scrcpy) - 原版 ws-scrcpy
- [mbebenita/Broadway](https://github.com/mbebenita/Broadway) - H.264 解码器
- [udevbe/tinyh264](https://github.com/udevbe/tinyh264) - TinyH264 解码器
- [DeviceFarmer/adbkit](https://github.com/DeviceFarmer/adbkit) - ADB 客户端
- [xtermjs/xterm.js](https://github.com/xtermjs/xterm.js) - 终端模拟器

## scrcpy WebSocket 分支

本项目使用的 scrcpy-server 基于官方 scrcpy v3.1 版本，添加了 WebSocket 支持：

- [预构建包](vendor/Genymobile/scrcpy/server/scrcpy-server)
- [源代码](https://github.com/EucalyZ/scrcpy/tree/websocket)

## 许可证

[MIT License](LICENSE)
