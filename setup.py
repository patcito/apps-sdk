#!/usr/bin/env python
#
# Copyright (c) 2010 BitTorrent Inc.
#

"""
Full fledged build tool for Griffin applications.
"""

__author__ = 'Thomas Rampelberg'
__author_email__ = 'thomas@bittorrent.com'
__date__ = "%date%"
__version__ = "%version%"

from setuptools import setup, find_packages

setup(
    name = "apps",
    version = '0.1',
    packages = find_packages(),
    author = __author__,
    author_email = __author_email__,
    description = "Build tool to develop, build and package apps.",
    install_requires = [ 'mako', 'boto', 'pydns' ],
    include_package_data = True,
    package_data = {
        "": ['data/*', 'data/.*'],
        },
    entry_points = {
        'console_scripts': [
            'apps = apps.vanguard:run',
            ],
        }
    )
