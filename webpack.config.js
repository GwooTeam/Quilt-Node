const path = require('path');

module.exports = {
  entry: './frontend/tempIndex_buttons.ts', // 입력 파일 경로
  target: 'electron-renderer', // 타겟 플랫폼 설정 (Electron 환경)
  module: {
    rules: [
      {
        test: "/\.ts$/", // .ts 확장자를 가진 모든 파일에 대해...
        include: "/frontend/", // src 폴더 내에서...
        use: [{ loader: "ts-loader" }] // ts-loader를 사용하여 변환한다.
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'), // 출력 디렉토리 경로
    filename: 'tempIndex_buttons.js' // 출력할 번들 이름
  },
  resolve: {
    extensions:['.tsx','.ts','.js'] 
   }
};