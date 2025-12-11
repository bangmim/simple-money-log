import React from 'react';
import {Modal, View, StyleSheet} from 'react-native';
import {Typography} from '../Typography';
import {Button} from '../Button';
import {Input} from '../Input';
import colors from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type NicknameEditModalProps = {
  visible: boolean;
  nickname: string;
  onNicknameChange: (nickname: string) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
  originalNickname: string;
};

export const NicknameEditModal: React.FC<NicknameEditModalProps> = ({
  visible,
  nickname,
  onNicknameChange,
  onSave,
  onCancel,
  loading = false,
  originalNickname,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Typography variant="h3" style={styles.title}>
            닉네임 수정
          </Typography>
          <Input
            value={nickname}
            onChangeText={onNicknameChange}
            placeholder="닉네임을 입력하세요"
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="저장" onPress={onSave} disabled={loading} />
            </View>
            <View style={styles.button}>
              <Button
                title="취소"
                onPress={() => {
                  onNicknameChange(originalNickname);
                  onCancel();
                }}
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.horizontal,
  },
  container: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: spacing.large,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: spacing.medium,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.small,
    marginTop: spacing.medium,
  },
  button: {
    flex: 1,
  },
});
