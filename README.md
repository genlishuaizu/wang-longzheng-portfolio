# 王泷正作品集网站

这是由 `作品集.pptx` 转换成的静态作品集网站。页面使用 PPT 中的 34 张高清页面图，并额外生成轻量 WebP 图用于线上浏览。

## 本地预览

```bash
python3 -m http.server 5173
```

然后访问 `http://localhost:5173`。

## GitHub Pages 部署

1. 创建一个新的 GitHub 仓库。
2. 把本文件夹推送到仓库的 `main` 分支。
3. 在仓库的 `Settings -> Pages` 中选择 `Deploy from a branch`。
4. 分支选择 `main`，目录选择 `/root`。
5. 保存后等待部署完成。

部署完成后，GitHub 会提供一个公网访问链接。
