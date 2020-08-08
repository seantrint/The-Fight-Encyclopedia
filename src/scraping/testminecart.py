# -*- coding: utf-8 -*-
"""
Created on Sun Jun  7 15:15:29 2020

@author: Sean
"""


import minecart

# minecart units are 1/72 inch, measured from bottom-left of the page
ROW_BORDERS = (
    72 * 1,  # Bottom row starts 1 inch from the bottom of the page
    72 * 3,  # Second row starts 3 inches from the bottom of the page
    72 * 5,  # Third row starts 5 inches from the bottom of the page
    72 * 7,  # Third row ends 7 inches from the bottom of the page
)
COLUMN_BORDERS = (
    72 * 8,  # Third col ends 8 inches from the left of the page
    72 * 6,  # Third col starts 6 inches from the left of the page
    72 * 4,  # Second col starts 4 inches from the left of the page   
    72 * 2,  # First col starts 2 inches from the left of the page
)  # reversed so that BOXES is ordered properly
BOXES = [
    (left, bot, right, top)
    for top, bot in zip(ROW_BORDERS, ROW_BORDERS[1:])
    for left, right in zip(COLUMN_BORDERS, COLUMN_BORDERS[1:])
]

def extract_output(page):
    """
    Reads the text from page and splits it into the 9 cells.

    Returns a list with 9 entries: 

        [A, B, C, D, E, F, G, H, I]

    Each item in the tuple contains a string with all of the
    text found in the cell.

    """
    res = []
    for box in BOXES:
        strings = list(page.letterings.iter_in_bbox(box))
        # We sort from top-to-bottom and then from left-to-right, based
        # on the strings' top left corner
        strings.sort(key=lambda x: (-x.bbox[3], x.bbox[0]))
        res.append(" ".join(strings).replace(u"\xa0", " ").strip())
    return res

content = []
doc = minecart.Document(open("C:/Users/Sean/Desktop/projects/Pdfs_from_scan/The boxing register  International Boxing Hall of Fame official record book by Roberts, James B. Skutt, Alexander G (z-lib.org).pdf", encoding= "utf-8"))
for page in doc.iter_pages():
    content.append(extract_output(page))