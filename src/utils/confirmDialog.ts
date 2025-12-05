import {Alert} from 'react-native';

type ConfirmDialogOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export const confirmDialog = ({
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogOptions) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style:
          confirmText === '삭제' || confirmText === '로그아웃'
            ? 'destructive'
            : 'default',
        onPress: onConfirm,
      },
    ],
    {cancelable: true},
  );
};
