import React, {useState, useEffect} from 'react';
import {View, Pressable, ScrollView} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import {Typography} from './Typography';
import {MonthlySummaryItem} from './MonthlySummaryItem';
import colors from '../theme/colors';
import {spacing} from '../theme/spacing';

type MonthlySummary = {
  key: string;
  label: string;
  expense: number;
  income: number;
};

type MonthlySummaryCardProps = {
  monthlySummary: MonthlySummary[];
  period: '3m' | '1y';
};

export const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({
  monthlySummary,
  period,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // period 변경 시 펼침 상태 초기화
    setIsExpanded(false);
  }, [period]);

  if (monthlySummary.length === 0) {
    return (
      <View
        style={{
          marginBottom: spacing.vertical,
          padding: spacing.vertical,
          borderRadius: 12,
          backgroundColor: colors.backgroundSecondary,
        }}>
        <Typography variant="caption" color={colors.textSecondary}>
          최근 3개월에 대한 데이터가 없습니다.
        </Typography>
      </View>
    );
  }

  const title = period === '1y' ? '올해 전체 요약' : '최근 3개월 요약';
  const showExpandButton = period === '1y';
  const visibleItems =
    period === '3m' || !isExpanded
      ? monthlySummary.slice(0, 3)
      : monthlySummary;

  return (
    <View
      style={{
        marginBottom: spacing.vertical,
        padding: spacing.vertical,
        borderRadius: 12,
        backgroundColor: colors.backgroundSecondary,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <Typography variant="bodyBold">{title}</Typography>
        {showExpandButton && (
          <Pressable
            onPress={() => setIsExpanded(!isExpanded)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Typography variant="caption" color={colors.primary} fontSize={12}>
              {isExpanded ? '접기' : '펼쳐보기'}
            </Typography>
            <View style={{marginLeft: 4}}>
              <FontAwesomeIcon
                icon={isExpanded ? faChevronUp : faChevronDown}
                size={12}
                color={colors.primary}
              />
            </View>
          </Pressable>
        )}
      </View>

      {period === '3m' || !isExpanded ? (
        // 접혀있을 때 또는 3개월 모드: 처음 3개월만 표시
        visibleItems.map(summary => (
          <MonthlySummaryItem
            key={summary.key}
            label={summary.label}
            expense={summary.expense}
            income={summary.income}
          />
        ))
      ) : (
        // 펼쳐보기 클릭 시: 스크롤 가능
        <ScrollView
          style={{maxHeight: 180}}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}>
          {monthlySummary.map(summary => (
            <MonthlySummaryItem
              key={summary.key}
              label={summary.label}
              expense={summary.expense}
              income={summary.income}
            />
          ))}
        </ScrollView>
      )}

      {period === '1y' && !isExpanded && (
        <Pressable onPress={() => setIsExpanded(true)} style={{marginTop: 8}}>
          <Typography
            variant="caption"
            color={colors.primary}
            style={{textAlign: 'center'}}>
            외 {monthlySummary.length - 3}개월 더 보기
          </Typography>
        </Pressable>
      )}
    </View>
  );
};
