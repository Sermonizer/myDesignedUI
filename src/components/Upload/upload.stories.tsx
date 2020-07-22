import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Upload, UploadFile } from "./upload";
import Button from "../Button/button";
import Icon from "../Icon/icon";

// 测试默认fileList的不同状态
const defaultFileList: UploadFile[] = [
  {
    uid: "1",
    size: 1024,
    name: "正在上传.md",
    status: "uploading",
    percent: 20,
  },
  { uid: "2", size: 1024, name: "上传成功.md", status: "success", percent: 80 },
  { uid: "3", size: 1024, name: "上传失败.md", status: "error", percent: 30 },
];

const simpleUpload = () => {
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={action("changed")}
      defaultFileList={defaultFileList}
      onRemove={action("removed")}
    >
      <Button>上传文件</Button>
    </Upload>
  );
};

// 用户自定义文件属性
const userUpload = () => {
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={action("changed")}
      onRemove={action("removed")}
      name="fileName"
      data={{ key: "value" }}
      headers={{ MyHeader: "hello" }}
    >
      <Button>上传文件</Button>
      <br />
      <br />
      <p>查看方式: 上传文件后, 按F12在Network中查看</p>
    </Upload>
  );
};

// 支持多选以及文件类型
const acceptUpload = () => {
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={action("changed")}
      onRemove={action("removed")}
      accept=".jpg"
      multiple
    >
      <Button>上传图片</Button>
    </Upload>
  );
};

// 判断文件大小，过大要发出提醒
// const checkFileSize = (file: File) => {
//   if (Math.round(file.size / 1024) > 50) {
//     alert("文件太大了")
//     return false
//   }
//   return true
// }

// 文件重命名
// const fileRename = (file: File) => {
//   const newFile = new File([file], 'new.docx', {type: file.type})
//   return Promise.resolve(newFile)
// }

// const defaultUpload = () => (
//   <Upload
//       action="https://jsonplaceholder.typicode.com/posts/"
//       onProgress={action('progress')}
//       onSuccess={action('success')}
//       onError={action('error')}
//       onChange={action('change')}
//       onRemove={action('remove')}
//   />
// );

const cycleLifeUpload = () => {
  const beforeUpload = (file: UploadFile) => {
    if (file.size > 50000) {
      console.log("上传文件太大");
      return false;
    }
    return true;
  };
  return (
    <Upload
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onProgress={action("progress")}
      onSuccess={action("success")}
      onError={action("error")}
      onChange={action("change")}
    >
      <Button>upload file</Button>
    </Upload>
  );
};

const dropUploadFile = () => (
  <Upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76" drag={true}>
    <Icon icon="upload" size="4x" />
    <br />
    <br />
    <span>支持拖拽上传</span>
  </Upload>
);

storiesOf("Upload component", module)
  .add("Upload", simpleUpload)
  .add("用户自定义参数", userUpload)
  .add("用户自定义上传文件类型", acceptUpload)
  .add("complete cycleLife Upload Component", cycleLifeUpload)
  .add("drop upload file - Upload", dropUploadFile);
