export interface VideoChapter {
  time: number; // in seconds
  title: string;
  lessonId?: string;
  summary: string;
}

export interface VideoItem {
  id: string;
  title: string;
  channel: string;
  youtubeId: string;
  watchUrl: string;
  chapters: VideoChapter[];
}

export const CHAPTERS_RAW = `⭐️Course Contents ⭐️ Section 1: Objective of the course ([0:00](https://www.youtube.com/watch?v=zJ-LqeX_fLU)) Course Introduction ([01:21](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=81s)) Section 2: Foundation of Electronics ([01:36](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=96s)) Electricity ([02:10](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=130s)) Static Electricity ([03:37](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=217s)) Current Electricity ([04:12](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=252s)) Voltage ([06:09](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=369s)) Current ([08:45](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=525s)) Resistance ([10:05](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=605s)) Ohm’s Law ([11:55](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=715s)) Ohm’s Law Example ([13:46](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=826s)) Resistances in Series and Parallel ([26:03](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1563s)) Resistance Color Coding ([28:26](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1706s)) Section 3: Intro to Arduino Board ([28:46](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1726s)) What is Microcontroller and Microprocessor ([31:16](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1876s)) What category Arduino falls into? ([31:33](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1893s)) Different Types of Arduino Boards ([32:03](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1923s)) About Arduino ([33:04](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=1984s)) Parts of Arduino Uno ([35:52](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2152s)) Technical Specifications of Arduino Uno Section 4: Intro to Arduino IDE ([38:58](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2338s)) What is IDE? ([40:14](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2414s)) Downloading and Installing the official IDE ([41:51](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2511s)) Preparing your computer ([43:08](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2588s)) Testing the Arduino. ([44:22](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2662s)) What if you don’t have an Arduino board? ([46:34](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2794s)) Section 5: Before we move ahead ([47:04](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2824s)) What is breadboard? ([49:16](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=2956s)) How to make connections in breadboard? ([1:00:10](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=3610s&pp=0gcJCWMAwfN6Pr3D)) Some safety instructions and Do’s and Don’ts ([1:01:53](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=3713s)) Input & Output ([1:08:47](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4127s&pp=0gcJCWMAwfN6Pr3D)) Analog & Digital ([1:14:04](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4444s&pp=0gcJCWMAwfN6Pr3D)) Bit & Byte ([1:16:26](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4586s)) Section 6: Arduino Programming ([1:16:46](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4606s)) Introduction ([1:17:41](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4661s)) The First Step into Programming ([1:19:37](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4777s)) Bare minimum structure of an Arduino Program ([1:20:21](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4821s)) Comments ([1:21:37](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=4897s)) White Spaces and Case Sensitivity ([1:24:06](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=5046s&pp=0gcJCWMAwfN6Pr3D)) pinMode ([1:26:44](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=5204s)) digitalWrite and delay ([1:29:51](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=5391s)) Camel casing Section 6.1 Introduction to Variables and Data Types ([1:30:51](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=5451s&pp=0gcJCWMAwfN6Pr3D)) What are variables and data types ([1:31:31](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=5491s)) Int data type ([1:35:11](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=5711s)) Arithmetic operators ([1:41:51](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6111s)) Incrementing and Decrementing our variables ([1:44:14](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6254s)) Float data type ([1:46:48](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6408s)) Bool/Boolean data type ([1:49:24](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6564s)) Byte data type ([1:50:27](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6627s)) Char data type ([1:52:46](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6766s)) Conclusion Section 6.2 Variable Scope and Qualifiers ([1:53:19](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=6799s)) What is Scope? Global and Local Variables ([1:57:59](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=7079s)) What are Qualifiers, starting with const qualifier ([1:59:51](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=7191s)) Alternative to const qualifier: #define ([2:01:55](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=7315s)) Static Qualifier Section 6.2 Comparison and Logical Operators ([2:04:25](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=7465s)) What are comparison operators? ([2:08:58](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=7738s)) What are Logical Operators? ([2:13:16](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=7996s)) Section 6.3 Control Structures ([2:14:21](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=8061s)) if statement ([2:20:47](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=8447s)) else statement ([2:24:24](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=8664s)) A joke :P ([2:25:10](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=8710s)) if - else Simulation ([2:29:27](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=8967s)) Introduction to loop control structures ([2:30:52](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=9052s)) For loop ([2:41:02](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=9662s)) While loop ([2:45:49](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=9949s&pp=0gcJCWMAwfN6Pr3D)) do…while loop ([2:50:16](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=10216s)) break ([2:52:24](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=10344s)) continue ([2:55:05](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=10505s)) return ([2:56:41](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=10601s)) switch..case Section 6.4 Remaining data types ([3:01:30](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=10890s)) Arrays ([3:09:34](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=11374s)) Strings Section 6.5 Functions ([3:15:14](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=11714s)) What are functions? ([3:19:03](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=11943s)) Create your own functions Section 6.6 Arduino Built-in Functions and related concepts ([3:35:20](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=12920s)) digitalRead & digitalWrite ([3:41:49](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=13309s)) analogRead and Analog to Digital Converter (ADC) ([3:47:50](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=13670s)) analogWrite and Pulse Width Modulation (PWM) Section 6.7 Libraries ([3:56:25](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=14185s&pp=0gcJCWMAwfN6Pr3D)) What are Libraries? ([3:59:22](https://www.youtube.com/watch?v=zJ-LqeX_fLU&t=14362s)) How to add Libraries in Arduino IDE`;

/**
 * Match chapter title to existing lesson ID by keywords
 */
export function matchLessonId(title: string): string | undefined {
  const lower = title.toLowerCase();

  // Lesson 1: Meet the Board
  if (
    lower.includes('parts of arduino uno') ||
    lower.includes('technical specifications') ||
    lower.includes('intro to arduino board') ||
    lower.includes('meet the board')
  ) {
    return 'lesson-1';
  }
  // Lesson 2: Blink an LED
  if (
    lower.includes('digitalwrite and delay') ||
    lower.includes('digitalwrite') ||
    lower.includes('pinmode') ||
    lower.includes('blink an led')
  ) {
    return 'lesson-2';
  }
  // Lesson 3: Push a Button
  if (
    lower.includes('digitalread') ||
    lower.includes('input & output') ||
    lower.includes('input and output') ||
    lower.includes('push a button')
  ) {
    return 'lesson-3';
  }
  // Lesson 4: Turn a Knob
  if (
    lower.includes('analogread') ||
    lower.includes('analog to digital converter') ||
    lower.includes('turn a knob')
  ) {
    return 'lesson-4';
  }
  // Lesson 5: Mix Colours
  if (
    lower.includes('analogwrite') ||
    lower.includes('pwm') ||
    lower.includes('mix colours') ||
    lower.includes('mix colors')
  ) {
    return 'lesson-5';
  }

  return undefined;
}

function timeStringToSeconds(timeStr: string): number {
  const parts = timeStr.split(':').map((p) => parseInt(p, 10));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

/**
 * Parses timestamped chapter text into VideoChapter[]
 * Supports both Markdown YouTube links ([MM:SS](url)) and standard lines (00:00 Title)
 */
export function parseChapters(raw: string): VideoChapter[] {
  const chapters: VideoChapter[] = [];

  // Check if raw contains markdown timestamp links like ([01:21](url))
  const linkPattern = /\(?\[(\d{1,2}:\d{2}(?::\d{2})?)\]\([^\)]+\)\)?/g;
  const linkMatches: { timeStr: string; start: number; end: number }[] = [];
  let m: RegExpExecArray | null;

  while ((m = linkPattern.exec(raw)) !== null) {
    linkMatches.push({
      timeStr: m[1],
      start: m.index,
      end: linkPattern.lastIndex
    });
  }

  if (linkMatches.length > 0) {
    for (let i = 0; i < linkMatches.length; i++) {
      const cur = linkMatches[i];
      let text = raw.substring(i === 0 ? 0 : linkMatches[i - 1].end, cur.start).trim();

      // Clean course banner and formatting characters
      text = text
        .replace(/^⭐️\s*Course Contents\s*⭐️\s*/i, '')
        .replace(/^[\(\[\s–—:-]+/, '')
        .replace(/[\)\]\s–—:-]+$/, '')
        .trim();

      if (!text && i === 0) text = 'Objective of the course';

      const totalSeconds = timeStringToSeconds(cur.timeStr);
      const lessonId = matchLessonId(text);

      chapters.push({
        time: totalSeconds,
        title: text,
        lessonId,
        summary: text
      });
    }

    const trailing = raw.substring(linkMatches[linkMatches.length - 1].end).trim();
    const cleanTrailing = trailing.replace(/^[\(\[\s–—:-]+/, '').replace(/[\)\]\s–—:-]+$/, '').trim();
    if (cleanTrailing && chapters.length > 0) {
      chapters[chapters.length - 1].title += ' - ' + cleanTrailing;
      chapters[chapters.length - 1].summary += ' - ' + cleanTrailing;
    }
  } else {
    // Standard line-by-line format: "12:34 Title" or "1:02:15 Title"
    const lines = raw.split('\n');
    const lineRegex = /^\s*(?:(?:(\d{1,2}):)?(\d{1,2}):(\d{2}))\s*[-–:]?\s*(.*)$/;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const match = trimmed.match(lineRegex);
      if (match) {
        const hours = match[1] ? parseInt(match[1], 10) : 0;
        const minutes = parseInt(match[2], 10);
        const seconds = parseInt(match[3], 10);
        const title = match[4].trim() || `Chapter at ${match[0].split(' ')[0]}`;

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        const lessonId = matchLessonId(title);

        chapters.push({
          time: totalSeconds,
          title,
          lessonId,
          summary: title
        });
      }
    }
  }

  // If no timestamped items found, return fallback single chapter
  if (chapters.length === 0) {
    return [
      {
        time: 0,
        title: 'Full video',
        summary: 'Chapters not added yet'
      }
    ];
  }

  // Ensure chronological sort
  chapters.sort((a, b) => a.time - b.time);
  return chapters;
}

export const ARDUINO_BEGINNER_VIDEO: VideoItem = {
  id: 'arduino-fcc-beginners',
  title: 'Arduino Course for Beginners',
  channel: 'freeCodeCamp.org, by Ashish Bansal',
  youtubeId: 'zJ-LqeX_fLU',
  watchUrl: 'https://youtu.be/zJ-LqeX_fLU',
  chapters: parseChapters(CHAPTERS_RAW)
};
