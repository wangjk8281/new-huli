import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppScreen,
  HeaderBlock,
  PrimaryButton,
  ProgressBar,
  SectionTitle,
  Tag,
  WhiteCard,
  palette,
} from '@/components/huxuebao-ui';
import { type Lesson } from '@/data/huxuebao-data';
import { useHuxuebao } from '@/contexts/huxuebao-context';

function LessonCard({
  lesson,
  active,
  done,
  onPress,
}: {
  lesson: Lesson;
  active: boolean;
  done: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <WhiteCard bordered={!active} style={[styles.lessonCard, active && styles.lessonCardActive]}>
        <View style={styles.lessonHead}>
          <View style={styles.lessonMeta}>
            <Tag
              text={lesson.type === 'video' ? '视频' : lesson.type === 'article' ? '图文' : '动画'}
              tone={lesson.type === 'animation' ? 'peach' : 'green'}
            />
            {done ? <Tag text="已完成" tone="light" /> : null}
          </View>
          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
        </View>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonSummary}>{lesson.summary}</Text>
      </WhiteCard>
    </Pressable>
  );
}

export default function CourseScreen() {
  const {
    directions,
    selectedDirectionId,
    selectDirection,
    directionCourses,
    completedLessonIds,
    completeLesson,
  } = useHuxuebao();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  const selectedCourse = useMemo(() => {
    return (
      directionCourses.find((course) => course.id === selectedCourseId) ??
      directionCourses[0] ??
      null
    );
  }, [directionCourses, selectedCourseId]);

  const selectedLesson =
    selectedCourse?.lessons.find((lesson) => lesson.id === selectedLessonId) ??
    selectedCourse?.lessons[0] ??
    null;

  const courseProgress = selectedCourse
    ? Math.round(
        (selectedCourse.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length /
          selectedCourse.lessons.length) *
          100
      )
    : 0;

  return (
    <AppScreen>
      <HeaderBlock title="课程学习" subtitle="按路径浏览课程、图文和操作动画" />

      <WhiteCard style={styles.directionCard}>
        <Text style={styles.blockTitle}>学习方向</Text>
        <View style={styles.directionRow}>
          {directions.map((direction) => {
            const active = selectedDirectionId === direction.id;

            return (
              <Pressable key={direction.id} onPress={() => selectDirection(direction.id)} style={styles.directionButton}>
                <View style={[styles.directionChip, active && styles.directionChipActive]}>
                  <Text style={[styles.directionChipText, active && styles.directionChipTextActive]}>
                    {direction.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </WhiteCard>

      <WhiteCard style={styles.progressCard}>
        <Text style={styles.progressTitle}>{selectedCourse?.title ?? '暂无课程'}</Text>
        <ProgressBar value={courseProgress} />
        <Text style={styles.progressText}>
          已完成 {selectedCourse?.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length ?? 0} /{' '}
          {selectedCourse?.lessons.length ?? 0} 节
        </Text>
      </WhiteCard>

      <SectionTitle action={`${directionCourses.length} 门课程`} title="课程体系" />
      <View style={styles.courseList}>
        {directionCourses.map((course) => {
          const active = selectedCourse?.id === course.id;

          return (
            <Pressable key={course.id} onPress={() => setSelectedCourseId(course.id)}>
              <WhiteCard bordered={!active} style={[styles.courseCard, active && styles.courseCardActive]}>
                <Tag text={course.subtitle} tone={active ? 'green' : 'peach'} />
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDesc}>{course.description}</Text>
                <View style={styles.pointRow}>
                  {course.knowledgePoints.map((item) => (
                    <Tag key={item} text={item} tone="light" />
                  ))}
                </View>
              </WhiteCard>
            </Pressable>
          );
        })}
      </View>

      {selectedCourse ? (
        <>
          <SectionTitle title="课程内容" />
          <View style={styles.lessonList}>
            {selectedCourse.lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                active={selectedLesson?.id === lesson.id}
                done={completedLessonIds.includes(lesson.id)}
                lesson={lesson}
                onPress={() => setSelectedLessonId(lesson.id)}
              />
            ))}
          </View>

          {selectedLesson ? (
            <WhiteCard style={styles.detailCard}>
              <Tag
                text={
                  selectedLesson.type === 'video'
                    ? '视频学习'
                    : selectedLesson.type === 'article'
                      ? '图文学习'
                      : '操作流程动画'
                }
                tone="green"
              />
              <Text style={styles.detailTitle}>{selectedLesson.title}</Text>
              <Text style={styles.detailDesc}>{selectedLesson.summary}</Text>

              <View style={styles.highlightList}>
                {selectedLesson.highlights.map((item) => (
                  <View key={item} style={styles.highlightItem}>
                    <View style={styles.dot} />
                    <Text style={styles.highlightText}>{item}</Text>
                  </View>
                ))}
              </View>

              {selectedLesson.articleSections ? (
                <View style={styles.sectionList}>
                  {selectedLesson.articleSections.map((section) => (
                    <View key={section.heading} style={styles.sectionBlock}>
                      <Text style={styles.sectionHeading}>{section.heading}</Text>
                      <Text style={styles.sectionBody}>{section.body}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {selectedLesson.animationSteps ? (
                <View style={styles.sectionList}>
                  {selectedLesson.animationSteps.map((step, index) => (
                    <View key={step.title} style={styles.stepCard}>
                      <Text style={styles.stepTitle}>{`${index + 1}. ${step.title}`}</Text>
                      <Text style={styles.sectionBody}>{step.detail}</Text>
                      <Text style={styles.riskText}>{`易错点：${step.risk}`}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <PrimaryButton onPress={() => completeLesson(selectedLesson.id)} text="标记为已学" />
            </WhiteCard>
          ) : null}
        </>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  directionCard: {
    padding: 16,
    gap: 12,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.text,
  },
  directionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  directionButton: {
    minWidth: '30%',
  },
  directionChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  directionChipActive: {
    borderColor: '#CFE8D8',
    backgroundColor: '#EEF9F1',
  },
  directionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.muted,
  },
  directionChipTextActive: {
    color: palette.green,
  },
  progressCard: {
    padding: 16,
    gap: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.muted,
  },
  courseList: {
    gap: 12,
  },
  courseCard: {
    padding: 16,
    gap: 10,
  },
  courseCardActive: {
    backgroundColor: '#F8FCF9',
    borderWidth: 1,
    borderColor: '#CFE8D8',
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  courseDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    fontWeight: '500',
  },
  pointRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  lessonList: {
    gap: 12,
  },
  lessonCard: {
    padding: 16,
    gap: 8,
  },
  lessonCardActive: {
    borderWidth: 1,
    borderColor: '#CFE8D8',
    backgroundColor: '#F7FCF8',
  },
  lessonHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  lessonDuration: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.green,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
  },
  lessonSummary: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
  },
  detailCard: {
    padding: 18,
    gap: 14,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.text,
  },
  detailDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: palette.muted,
    fontWeight: '500',
  },
  highlightList: {
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.green,
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: palette.text,
    fontWeight: '500',
  },
  sectionList: {
    gap: 10,
  },
  sectionBlock: {
    borderRadius: 16,
    backgroundColor: '#F8F8F6',
    padding: 14,
    gap: 6,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  sectionBody: {
    fontSize: 13,
    lineHeight: 19,
    color: palette.muted,
    fontWeight: '500',
  },
  stepCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: '#FFFFFF',
    padding: 14,
    gap: 6,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.text,
  },
  riskText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#B16847',
    fontWeight: '600',
  },
});
