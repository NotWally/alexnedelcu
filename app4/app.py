import random
import pygame

# Constants
SCREEN_WIDTH, SCREEN_HEIGHT = 800, 600
BAR_WIDTH = 40
ARRAY_SIZE = 20
BAR_COLOR = (0, 0, 255)
BG_COLOR = (255, 255, 255)
SORTED_COLOR = (0, 200, 0)
DELAY = 50  # milliseconds
BUTTON_COLOR = (100, 200, 100)
BUTTON_HOVER = (120, 220, 120)
TEXT_COLOR = (0, 0, 0)

# Generate and shuffle array
array = list(range(1, ARRAY_SIZE + 1))
random.shuffle(array)

def draw_array(screen, array, current_index=None, comparing_index=None, sorted_upto=None):
    screen.fill(BG_COLOR)
    for i, value in enumerate(array):
        height = value * (SCREEN_HEIGHT // (ARRAY_SIZE + 2))
        x = i * BAR_WIDTH
        y = SCREEN_HEIGHT - height

        color = BAR_COLOR
        if i == current_index:
            color = (255, 0, 0)  # red
        elif i == comparing_index:
            color = (0, 255, 0)  # green
        elif sorted_upto is not None and i <= sorted_upto:
            color = SORTED_COLOR

        pygame.draw.rect(screen, color, (x, y, BAR_WIDTH - 2, height))

def draw_button(screen, rect, text, font, hover=False):
    pygame.draw.rect(screen, BUTTON_HOVER if hover else BUTTON_COLOR, rect)
    label = font.render(text, True, TEXT_COLOR)
    label_rect = label.get_rect(center=rect.center)
    screen.blit(label, label_rect)

def insertion_sort_visualized(screen, array):
    for i in range(1, len(array)):
        current_value = array[i]
        j = i - 1
        while j >= 0 and array[j] > current_value:
            array[j + 1] = array[j]
            draw_array(screen, array, current_index=i, comparing_index=j, sorted_upto=i)
            pygame.display.flip()
            pygame.time.delay(DELAY)
            j -= 1
        array[j + 1] = current_value
        draw_array(screen, array, current_index=i, comparing_index=j, sorted_upto=i)
        pygame.display.flip()
        pygame.time.delay(DELAY)

def main():
    pygame.init()
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Insertion Sort Visualization")
    font = pygame.font.SysFont(None, 36)

    sort_button = pygame.Rect(SCREEN_WIDTH // 2 - 75, 20, 150, 50)
    sort_started = False

    running = True
    while running:
        mouse_pos = pygame.mouse.get_pos()
        mouse_click = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                mouse_click = True

        if not sort_started:
            draw_array(screen, array)
            hover = sort_button.collidepoint(mouse_pos)
            draw_button(screen, sort_button, "Sort", font, hover)
            pygame.display.flip()

            if hover and mouse_click:
                sort_started = True
                insertion_sort_visualized(screen, array)
        else:
            draw_array(screen, array)
            pygame.display.flip()

    pygame.quit()

if __name__ == "__main__":
    main()
